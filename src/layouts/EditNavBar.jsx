import {
  Box,
  Code,
  HStack,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import { Button, Tag } from "@opengovsg/design-system-react"
import update from "immutability-helper"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import { Editable } from "components/Editable"
import { AddSectionButton } from "components/Editable/AddSectionButton"
import { Footer } from "components/Footer"
import { Greyscale } from "components/Greyscale"
import Header from "components/Header"
import { LoadingButton } from "components/LoadingButton"
import { WarningModal } from "components/WarningModal"

import { EditableContextProvider } from "contexts/EditableContext"

import {
  useGetFoldersAndPages,
  useGetResourceRoom,
  useGetResourceRoomName,
} from "hooks/directoryHooks"
import { useGetSecondLevelFoldersAndPages } from "hooks/directoryHooks/useGetSecondLevelFoldersAndPages"
import { useUpdateNavHook } from "hooks/navHooks"
import { useGetNavHook } from "hooks/navHooks/useGetNavHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import TemplateNavBar from "templates/NavBar"

import { isWriteActionsDisabled } from "utils/reviewRequests"
import { validateLink } from "utils/validators"

// Import API
import {
  deslugifyDirectory,
  getNavFolderDropdownFromFolderOrder,
  isEmpty,
} from "utils"

import { FolderMenuBody } from "./components/NavBar/FolderMenuBody"
import { GroupMenuBody } from "./components/NavBar/GroupMenuBody"
import { PageMenuBody } from "./components/NavBar/PageMenuBody"
import { ResourceMenuBody } from "./components/NavBar/ResourceMenuBody"

const RADIX_PARSE_INT = 10

const EditNavBar = ({ match }) => {
  const { siteName } = match.params

  const isWriteDisabled = isWriteActionsDisabled(siteName)

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
  const [hasResourceRoom, setHasResourceRoom] = useState(false)
  const [errors, setErrors] = useState({
    links: [],
    sublinks: [],
  })
  const [deletedLinks, setDeletedLinks] = useState([])

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

  const onDeleteClick = (id, name) => {
    onDeleteModalOpen()
    setItemPendingForDelete({ id, type: name })
  }

  const LinkCollectionSectionConstructor = () => ({
    title: "New folder",
    collection: collections[0],
  })

  const LinkResourceSectionConstructor = () => ({
    title: "New resource room",
    resource_room: true,
  })

  const LinkPageSectionConstructor = () => ({
    title: "New single page",
    url: "/permalink",
  })

  const LinkSublinkSectionConstructor = () => ({
    title: "New menu group",
    url: "/permalink",
    sublinks: [],
  })

  const SublinkSectionConstructor = () => ({
    title: "New submenu",
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
  const { data: navBarContents } = useGetNavHook(siteName)
  const { data: collectionsData } = useGetFoldersAndPages({ siteName })
  const { data: resourceRoomName } = useGetResourceRoomName(siteName)
  const { data: resourceRoomContents } = useGetResourceRoom({
    siteName,
    resourceRoomName: resourceRoomName || "",
  })
  const secondLevelData = useGetSecondLevelFoldersAndPages({
    siteName,
    collectionsData,
  })

  // update nav bar data
  const { mutateAsync: saveNavData } = useUpdateNavHook(siteName)

  useEffect(() => {
    if (_.isEmpty(navBarContents)) return

    const { content, sha: navSha } = navBarContents
    const initialCollections = collectionsData.map((item) => item.name)
    const initialOptions = initialCollections.map((collection) => ({
      value: collection,
      label: collection,
    }))
    const resourcesData = resourceRoomName
      ? resourceRoomContents?.map((resource) =>
          deslugifyDirectory(resource.name)
        )
      : undefined
    const foldersContent = secondLevelData
      ? secondLevelData.reduce((acc, curr) => {
          const { data } = curr
          const { collectionName, order } = data
          acc[collectionName] = getNavFolderDropdownFromFolderOrder(order)
          return acc
        }, {})
      : {}

    // Add booleans for displaying links and sublinks
    const { links: initialLinks } = content
    const initialDisplayLinks = []
    const initialDisplaySublinks = []
    const initialErrors = {
      links: _.fill(Array(initialLinks.length), enumSection("error")),
      sublinks: [],
    }
    const initialDeletedLinks = []
    const filteredInitialLinks = []
    initialLinks.forEach((link, idx) => {
      let numSublinks = 0
      if ("sublinks" in link) {
        numSublinks = link.sublinks.length
      }
      if ("collection" in link && !(link.collection in foldersContent)) {
        // Invalid collection linked
        initialDeletedLinks.push({ link, idx })
        return
      }
      filteredInitialLinks.push(link)
      initialDisplayLinks.push(false)
      initialDisplaySublinks.push(_.fill(Array(numSublinks), false))
      initialErrors.sublinks.push(
        _.fill(Array(numSublinks), enumSection("error"))
      )
    })

    setLinks(filteredInitialLinks)
    setHasLoaded(true)
    setDisplayLinks(initialDisplayLinks)
    setDisplaySublinks(initialDisplaySublinks)
    setDeletedLinks(initialDeletedLinks)
    setOriginalNav(content)
    setSha(navSha)
    setCollections(initialCollections)
    setOptions(initialOptions)
    setHasResourceRoom(!!resourceRoomName)
    setResources(resourcesData)
    setFolderDropdowns(foldersContent)
    setErrors(initialErrors)
  }, [navBarContents, collectionsData, resourceRoomName, resourceRoomContents])

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
        default:
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

    if (type === "link") {
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
    }
    if (type.startsWith("sublink-")) {
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
    }
  }

  const hasErrors = () => {
    return !isEmpty(errors.links) || !isEmpty(errors.sublinks)
  }

  return (
    <>
      {!_.isEmpty(deletedLinks) && (
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
              {deletedLinks.map(({ link, idx }) => (
                <>
                  <Text>
                    For link <Code>{idx}</Code>: <Code>{link.collection}</Code>{" "}
                    has been removed
                  </Text>
                </>
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
          colorScheme="critical"
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
        <Skeleton isLoaded={hasLoaded}>
          <EditableContextProvider
            onDragEnd={onDragEnd}
            onChange={onFieldChange}
            onCreate={createHandler}
            onDelete={onDeleteClick}
          >
            <Greyscale isActive={isWriteDisabled}>
              <HStack className={elementStyles.wrapper}>
                <Editable.Sidebar title="Navigation Bar">
                  <Editable.Accordion>
                    <VStack
                      bg="base.canvas.alt"
                      p="1.5rem"
                      spacing="1.5rem"
                      alignItems="flex-start"
                    >
                      <VStack spacing="0.5rem" alignItems="flex-start">
                        <Text textStyle="h5">Menu Items</Text>
                        <Text textStyle="body-2">
                          You can specify a folder or resource room to
                          automatically populate its links.
                        </Text>
                      </VStack>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Editable.Droppable
                          width="100%"
                          editableId="link"
                          onDragEnd={onDragEnd}
                        >
                          <Editable.EmptySection
                            title="Menu items you add will appear here"
                            subtitle="Start adding items to your navigation bar"
                            isEmpty={links.length === 0}
                          >
                            <VStack p={0} spacing="1.5rem">
                              {links.map((link, linkIndex) => (
                                <>
                                  {link.resource_room && (
                                    <Editable.DraggableAccordionItem
                                      index={linkIndex}
                                      tag={
                                        <Tag variant="subtle">
                                          Resource Room
                                        </Tag>
                                      }
                                      title={link.title}
                                      isInvalid={_.some(
                                        errors.links[linkIndex]
                                      )}
                                    >
                                      <ResourceMenuBody
                                        {...link}
                                        index={linkIndex}
                                        errors={errors.links[linkIndex]}
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}
                                  {link.collection && (
                                    <Editable.DraggableAccordionItem
                                      index={linkIndex}
                                      tag={<Tag variant="subtle">Folder</Tag>}
                                      title={link.title}
                                      isInvalid={_.some(
                                        errors.links[linkIndex]
                                      )}
                                    >
                                      <FolderMenuBody
                                        {...link}
                                        index={linkIndex}
                                        errors={errors.links[linkIndex]}
                                        options={options}
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}
                                  {link.sublinks && (
                                    <Editable.DraggableAccordionItem
                                      index={linkIndex}
                                      tag={
                                        <Tag variant="subtle">Menu group</Tag>
                                      }
                                      title={link.title}
                                      isInvalid={
                                        _.some(errors.links[linkIndex]) ||
                                        _.some(
                                          errors.sublinks[
                                            linkIndex
                                          ].map((sublink) => _.some(sublink))
                                        )
                                      }
                                    >
                                      <GroupMenuBody
                                        {...link}
                                        index={linkIndex}
                                        errors={{
                                          ...errors.links[linkIndex],
                                          sublinks: errors.sublinks[linkIndex],
                                        }}
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}
                                  {!link.resource_room &&
                                    !link.collection &&
                                    !link.sublinks && (
                                      <Editable.DraggableAccordionItem
                                        index={linkIndex}
                                        tag={
                                          <Tag variant="subtle">
                                            Single page
                                          </Tag>
                                        }
                                        title={link.title}
                                        isInvalid={_.some(
                                          errors.links[linkIndex]
                                        )}
                                      >
                                        <PageMenuBody
                                          {...link}
                                          index={linkIndex}
                                          errors={errors.links[linkIndex]}
                                        />
                                      </Editable.DraggableAccordionItem>
                                    )}
                                </>
                              ))}
                            </VStack>
                          </Editable.EmptySection>
                        </Editable.Droppable>
                      </DragDropContext>
                    </VStack>
                  </Editable.Accordion>

                  <Box px="1.5rem">
                    <AddSectionButton buttonText="Add menu item">
                      <AddSectionButton.List>
                        {/* NOTE: Check if the site contains any collections in `options`
                            if it does not, prevent creation of a `folder` section
                          */}
                        {options && options.length > 0 && (
                          <AddSectionButton.Option
                            title="Folder"
                            subtitle="Add a link to an existing Folder"
                            onClick={() => {
                              createHandler({
                                target: {
                                  id: `link-create`,
                                  value: "collectionLink",
                                },
                              })
                            }}
                          />
                        )}
                        <AddSectionButton.Option
                          title="Menu group"
                          subtitle="Add a custom group of links to your navigation bar"
                          onClick={() => {
                            createHandler({
                              target: {
                                id: `link-create`,
                                value: "sublinkLink",
                              },
                            })
                          }}
                        />
                        <AddSectionButton.Option
                          title="Single Page"
                          subtitle="Add a link to a single page on your navigation bar"
                          onClick={() => {
                            createHandler({
                              target: {
                                id: `link-create`,
                                value: "pageLink",
                              },
                            })
                          }}
                        />
                        {/* NOTE: Check if the site does not contain a resource room or any sections contain `resource_room`
                            If either condition is fulfilled, prevent creation of a `resource_room` section */}
                        {hasResourceRoom &&
                          !links.some(
                            ({ resource_room }) => !!resource_room
                          ) && (
                            <AddSectionButton.Option
                              title="Resource room"
                              subtitle="Add a link to your Resources"
                              onClick={() => {
                                createHandler({
                                  target: {
                                    id: `link-create`,
                                    value: "resourceLink",
                                  },
                                })
                              }}
                            />
                          )}
                      </AddSectionButton.List>
                    </AddSectionButton>
                  </Box>
                </Editable.Sidebar>
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
            </Greyscale>
          </EditableContextProvider>
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
              isDisabled={isWriteDisabled || hasErrors()}
              onClick={async () => saveNavData({ originalNav, links, sha })}
            >
              Save
            </LoadingButton>
          </Footer>
        </Skeleton>
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
