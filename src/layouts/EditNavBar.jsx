import { useDisclosure, Box, Text, HStack, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Footer } from "components/Footer"
import Header from "components/Header"
import { LoadingButton } from "components/LoadingButton"
import NavSection from "components/navbar/NavSection"
import { WarningModal } from "components/WarningModal"
import update from "immutability-helper"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useQuery, useMutation, useQueryClient } from "react-query"

import { NAVIGATION_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import TemplateNavBar from "templates/NavBar"

import { useErrorToast } from "utils/toasts"
import { validateLink } from "utils/validators"

// Import API
import { getEditNavBarData, updateNavBarData } from "api"
import { DEFAULT_RETRY_MSG, deslugifyDirectory, isEmpty } from "utils"

const RADIX_PARSE_INT = 10

const EditNavBar = ({ match }) => {
  // Instantiate queryClient
  const queryClient = useQueryClient()

  const { siteName } = match.params

  const { setRedirectToNotFound } = useRedirectHook()

  const [sha, setSha] = useState()
  const [links, setLinks] = useState([])
  const [originalNav, setOriginalNav] = useState()
  const [collections, setCollections] = useState([])
  const [folderDropdowns, setFolderDropdowns] = useState({})
  const [options, setOptions] = useState([])
  const [displayLinks, setDisplayLinks] = useState([])
  const [displaySublinks, setDisplaySublinks] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: "",
    type: "",
  })
  const [resources, setResources] = useState()
  const [hasResources, setHasResources] = useState(false)
  const [hasResourceRoom, setHasResourceRoom] = useState(false)
  const [errors, setErrors] = useState({
    links: [],
    sublinks: [],
  })
  const [deletedLinks, setDeletedLinks] = useState("")

  const {
    isOpen: isRemovedContentWarningOpen,
    onOpen: onRemovedContentWarningOpen,
    onClose: onRemovedContentWarningClose,
  } = useDisclosure({ defaultIsOpen: true })
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()

  const [hasChanges, setHasChanges] = useState(false)

  const errorToast = useErrorToast()

  const LinkCollectionSectionConstructor = () => ({
    title: "Menu Title",
    collection: collections[0],
  })

  const LinkResourceSectionConstructor = () => ({
    title: "Menu Title",
    resource_room: true,
  })

  const LinkPageSectionConstructor = () => ({
    title: "Menu Title",
    url: "/permalink",
  })

  const LinkSublinkSectionConstructor = () => ({
    title: "Menu Title",
    url: "/permalink",
    sublinks: [],
  })

  const SublinkSectionConstructor = () => ({
    title: "Submenu Title",
    url: "/permalink",
  })

  const ErrorConstructor = () => ({
    title: "",
    url: "",
  })

  const enumSection = (type) => {
    switch (type) {
      case "collectionLink":
        return LinkCollectionSectionConstructor()
      case "resourceLink":
        return LinkResourceSectionConstructor()
      case "pageLink":
        return LinkPageSectionConstructor()
      case "sublinkLink":
        return LinkSublinkSectionConstructor()
      case "sublink":
        return SublinkSectionConstructor()
      case "error":
        return ErrorConstructor()
      default:
        throw new Error(
          "Unreachable path! Please ensure all possible enums are covered."
        )
    }
  }

  // get nav bar data
  const { data: navigationContents } = useQuery(
    [NAVIGATION_CONTENT_KEY, siteName],
    () => getEditNavBarData(siteName),
    {
      enabled: !hasChanges,
      retry: false,
      cacheTime: 0, // We want to refetch data on every page load because file order may have changed
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast({
            description: `There was a problem trying to load your data. ${DEFAULT_RETRY_MSG}`,
          })
        }
      },
    }
  )

  // update nav bar data
  const { mutateAsync: saveNavData } = useMutation(
    () => updateNavBarData(siteName, originalNav, links, sha),
    {
      onError: () =>
        errorToast({
          description: `There was a problem trying to save your nav bar. ${DEFAULT_RETRY_MSG}`,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries([NAVIGATION_CONTENT_KEY, siteName])
        window.location.reload()
      },
    }
  )

  // process nav bar data on mount
  useEffect(() => {
    let _isMounted = true
    if (!_.isEmpty(navigationContents)) {
      const {
        navContent,
        navSha,
        collectionContent,
        foldersContent,
        resourceContent,
      } = navigationContents

      const { links: initialLinks } = navContent

      let navHasResources = false
      // Add booleans for displaying links and sublinks
      const initialDisplayLinks = []
      const initialDisplaySublinks = []
      const initialErrors = {
        links: _.fill(Array(initialLinks.length), enumSection("error")),
        sublinks: [],
      }
      let deletedDisplayText = ""
      const filteredInitialLinks = []
      initialLinks.forEach((link, idx) => {
        let numSublinks = 0
        if ("sublinks" in link) {
          numSublinks = link.sublinks.length
        }
        if ("resource_room" in link) navHasResources = true
        if ("collection" in link && !(link.collection in foldersContent)) {
          // Invalid collection linked
          deletedDisplayText += `<br/>For link <code>${idx + 1}</code>: <br/>`
          deletedDisplayText += `    <code>${link.collection}</code> has been removed</br>`
          return
        }
        filteredInitialLinks.push(link)
        initialDisplayLinks.push(false)
        initialDisplaySublinks.push(_.fill(Array(numSublinks), false))
        initialErrors.sublinks.push(
          _.fill(Array(numSublinks), enumSection("error"))
        )
      })

      const { collections: initialCollections } = collectionContent
      const { resourceRoomName, resources: initialResource } = resourceContent

      const initialOptions = initialCollections.map((collection) => ({
        value: collection,
        label: collection,
      }))

      if (_isMounted) {
        setLinks(filteredInitialLinks)
        setHasLoaded(true)
        setDisplayLinks(initialDisplayLinks)
        setDisplaySublinks(initialDisplaySublinks)
        setCollections(initialCollections)
        setFolderDropdowns(foldersContent)
        setOptions(initialOptions)
        setHasResourceRoom(!!resourceRoomName)
        if (resourceRoomName)
          setResources(
            initialResource.map((resource) =>
              deslugifyDirectory(resource.dirName)
            )
          )
        setOriginalNav(navContent)
        setSha(navSha)
        setHasResources(navHasResources)
        setErrors(initialErrors)
        setDeletedLinks(deletedDisplayText)
      }
    }

    return () => {
      _isMounted = false
    }
  }, [navigationContents])

  useEffect(() => {
    setHasChanges(
      JSON.stringify(originalNav) !==
        JSON.stringify({
          ...originalNav,
          links,
        })
    )
  }, [originalNav, links])

  const onFieldChange = async (event) => {
    try {
      const { id, value } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]

      switch (elemType) {
        case "link": {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2]
          const newLinks = update(links, {
            [linkIndex]: {
              [field]: {
                $set: value,
              },
            },
          })
          const newErrors = update(errors, {
            links: {
              [linkIndex]: {
                [field]: {
                  $set: validateLink(field, value),
                },
              },
            },
          })
          setLinks(newLinks)
          setErrors(newErrors)
          break
        }
        case "sublink": {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const field = idArray[3]
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                [sublinkIndex]: {
                  [field]: {
                    $set: value,
                  },
                },
              },
            },
          })
          const newErrors = update(errors, {
            sublinks: {
              [linkIndex]: {
                [sublinkIndex]: {
                  [field]: {
                    $set: validateLink(field, value),
                  },
                },
              },
            },
          })
          setLinks(newLinks)
          setErrors(newErrors)
          break
        }
        default: {
          return
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createHandler = async (event) => {
    try {
      const { id, value } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]

      switch (elemType) {
        case "link": {
          const newLinks = update(links, {
            $push: [enumSection(value)],
          })
          if (value === "resourceLink") setHasResources(true)
          const resetDisplayLinks = _.fill(Array(links.length), false)
          const resetDisplaySublinks = []
          links.forEach((link) => {
            let numSublinks = 0
            if ("sublinks" in link) {
              numSublinks = link.sublinks.length
            }
            resetDisplaySublinks.push(_.fill(Array(numSublinks), false))
          })
          const newDisplayLinks = update(resetDisplayLinks, {
            $push: [true],
          })
          const newLinkErrors = update(errors, {
            links: {
              $push: [enumSection("error")],
            },
          })
          const newErrors = update(newLinkErrors, {
            sublinks: {
              $push: [[]],
            },
          })
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(resetDisplaySublinks)
          setErrors(newErrors)
          break
        }
        case "sublink": {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                $push: [enumSection(elemType)],
              },
            },
          })
          const resetDisplaySublinks = []
          links.forEach((link) => {
            let numSublinks = 0
            if ("sublinks" in link) {
              numSublinks = link.sublinks.length
            }
            resetDisplaySublinks.push(_.fill(Array(numSublinks), false))
          })
          const newDisplaySublinks = update(resetDisplaySublinks, {
            [linkIndex]: {
              $push: [true],
            },
          })
          const newErrors = update(errors, {
            sublinks: {
              [linkIndex]: {
                $push: [enumSection("error")],
              },
            },
          })
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        default:
          return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split("-")
      const elemType = idArray[0]

      switch (elemType) {
        case "link": {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          if ("resource_room" in links[linkIndex]) setHasResources(false)
          const newLinks = update(links, {
            $splice: [[linkIndex, 1]],
          })
          const newDisplayLinks = update(displayLinks, {
            $splice: [[linkIndex, 1]],
          })
          const newDisplaySublinks = update(displaySublinks, {
            $splice: [[linkIndex, 1]],
          })
          const newLinkErrors = update(errors, {
            links: {
              $splice: [[linkIndex, 1]],
            },
          })
          const newErrors = update(newLinkErrors, {
            sublinks: {
              $splice: [[linkIndex, 1]],
            },
          })
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        case "sublink": {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                $splice: [[sublinkIndex, 1]],
              },
            },
          })
          const newDisplaySublinks = update(displaySublinks, {
            [linkIndex]: {
              $splice: [[sublinkIndex, 1]],
            },
          })
          const newErrors = update(errors, {
            sublinks: {
              [linkIndex]: {
                $splice: [[sublinkIndex, 1]],
              },
            },
          })
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        default:
          return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const displayHandler = async (event) => {
    try {
      const { id } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]
      switch (elemType) {
        case "link": {
          const linkId = idArray[1]
          const resetDisplayLinks = _.fill(Array(links.length), false)
          resetDisplayLinks[linkId] = !displayLinks[linkId]
          const newDisplayLinks = update(displayLinks, {
            $set: resetDisplayLinks,
          })

          setDisplayLinks(newDisplayLinks)
          break
        }
        case "sublink": {
          const linkId = idArray[1]
          const sublinkId = idArray[2]
          const resetSublinkSections = _.fill(
            Array(displaySublinks[linkId].length),
            false
          )
          resetSublinkSections[sublinkId] = !displaySublinks[linkId][sublinkId]
          const newDisplaySublinks = update(displaySublinks, {
            [linkId]: {
              $set: resetSublinkSections,
            },
          })

          setDisplaySublinks(newDisplaySublinks)
          break
        }
        default:
          return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onDragEnd = (result) => {
    const { source, destination, type } = result

    // If the user dropped the draggable to no known droppable
    if (!destination) return

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    switch (type) {
      case "link": {
        const draggedLink = links[source.index]
        const newLinks = update(links, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedLink], // Splice elem into its new position
          ],
        })
        const displayLinkBool = displayLinks[source.index]
        const displaySublinkBools = displaySublinks[source.index]
        const linkErrors = errors.links[source.index]
        const sublinkErrors = errors.sublinks[source.index]
        const newDisplayLinks = update(displayLinks, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayLinkBool],
          ],
        })
        const newDisplaySublinks = update(displaySublinks, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displaySublinkBools],
          ],
        })
        const newLinkErrors = update(errors, {
          links: {
            $splice: [
              [source.index, 1],
              [destination.index, 0, linkErrors],
            ],
          },
        })
        const newErrors = update(newLinkErrors, {
          sublinks: {
            $splice: [
              [source.index, 1],
              [destination.index, 0, sublinkErrors],
            ],
          },
        })
        setLinks(newLinks)
        setDisplayLinks(newDisplayLinks)
        setDisplaySublinks(newDisplaySublinks)
        setErrors(newErrors)
        break
      }
      case "sublink": {
        const idArray = source.droppableId.split("-")
        const linkIndex = idArray[1]
        const draggedSublink = links[linkIndex].sublinks[source.index]
        const sublinkErrors = errors.sublinks[linkIndex][source.index]
        const newLinks = update(links, {
          [linkIndex]: {
            sublinks: {
              $splice: [
                [source.index, 1],
                [destination.index, 0, draggedSublink],
              ],
            },
          },
        })
        const displaySublinkBool = displaySublinks[linkIndex][source.index]
        const newDisplaySublinks = update(displaySublinks, {
          [linkIndex]: {
            $splice: [
              [source.index, 1],
              [destination.index, 0, displaySublinkBool],
            ],
          },
        })
        const newErrors = update(errors, {
          sublinks: {
            [linkIndex]: {
              $splice: [
                [source.index, 1],
                [destination.index, 0, sublinkErrors],
              ],
            },
          },
        })
        setLinks(newLinks)
        setDisplaySublinks(newDisplaySublinks)
        setErrors(newErrors)
        break
      }
      default:
    }
  }

  const hasErrors = () => {
    return !isEmpty(errors.links) || !isEmpty(errors.sublinks)
  }

  return (
    <>
      {!isEmpty(deletedLinks) && (
        <WarningModal
          isOpen={isRemovedContentWarningOpen}
          onClose={onRemovedContentWarningClose}
          displayTitle="Removed content"
          displayText={
            <Box>
              <Text>
                Some of your content has been removed as they attempt to link to
                invalid folders. No changes are permanent unless you press Save
                on the next page.
              </Text>
              <br />
              {deletedLinks.map((link) => (
                <Text>{link}</Text>
              ))}
            </Box>
          }
        >
          <Button onClick={onRemovedContentWarningClose}>Acknowledge</Button>
        </WarningModal>
      )}
      <WarningModal
        isOpen={itemPendingForDelete.id && isDeleteModalOpen}
        onClose={() => {
          setItemPendingForDelete({ id: null, type: "" })
          onDeleteModalClose()
        }}
        displayTitle={`Delete ${itemPendingForDelete.type}`}
        displayText={
          <Text>
            Are you sure you want to delete {itemPendingForDelete.type}?
          </Text>
        }
      >
        <Button
          variant="clear"
          colorScheme="secondary"
          onClick={() => {
            setItemPendingForDelete({ id: null, type: "" })
            onDeleteModalClose()
          }}
        >
          Cancel
        </Button>
        <Button
          colorScheme="danger"
          onClick={() => {
            deleteHandler(itemPendingForDelete.id)
            setItemPendingForDelete({ id: null, type: "" })
            onDeleteModalClose()
          }}
        >
          Delete
        </Button>
      </WarningModal>
      <VStack>
        <Header
          title="Navigation Bar"
          shouldAllowEditPageBackNav={!hasChanges}
          isEditPage
          backButtonText="Back to My Workspace"
          backButtonUrl={`/sites/${siteName}/workspace`}
        />
        {hasLoaded && (
          <>
            <HStack className={elementStyles.wrapper}>
              <div className={editorStyles.homepageEditorSidebar}>
                <div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <NavSection
                      links={links}
                      options={options}
                      createHandler={createHandler}
                      deleteHandler={(event) => {
                        onDeleteModalOpen()
                        setItemPendingForDelete({
                          id: event.target.id,
                          type: "Link",
                        })
                      }}
                      onFieldChange={onFieldChange}
                      displayHandler={displayHandler}
                      displayLinks={displayLinks}
                      displaySublinks={displaySublinks}
                      hasResourceRoom={hasResourceRoom}
                      hasResources={hasResources}
                      errors={errors}
                    />
                  </DragDropContext>
                </div>
              </div>
              {/* need to change the css here */}
              <div className={`${editorStyles.contactUsEditorMain} `}>
                {/* navbar content */}
                {/* TODO: update collectionInfo */}
                <TemplateNavBar
                  links={links}
                  collectionInfo={folderDropdowns}
                  resources={resources}
                />
              </div>
            </HStack>
            <Footer>
              {!isEmpty(deletedLinks) && (
                <Button
                  ml="auto"
                  variant="clear"
                  onClick={onRemovedContentWarningOpen}
                >
                  See removed content
                </Button>
              )}
              <LoadingButton
                isDisabled={hasErrors()}
                onClick={() => saveNavData(siteName, originalNav, links, sha)}
              >
                Save
              </LoadingButton>
            </Footer>
          </>
        )}
      </VStack>
    </>
  )
}

export default EditNavBar

EditNavBar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
