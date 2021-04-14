import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { useQuery, useMutation } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { DragDropContext } from 'react-beautiful-dnd';

import { DEFAULT_RETRY_MSG, deslugifyDirectory, isEmpty } from '../utils';
import { NAVIGATION_CONTENT_KEY } from '../constants'
import { validateLink } from '../utils/validators';
import { errorToast } from '../utils/toasts';

import useRedirectHook from '../hooks/useRedirectHook';

import Header from '../components/Header';
import LoadingButton from '../components/LoadingButton';
import DeleteWarningModal from '../components/DeleteWarningModal';
import GenericWarningModal from '../components/GenericWarningModal';
import NavSection from '../components/navbar/NavSection'

import TemplateNavBar from '../templates/NavBar'

import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';

// Import API
import { getEditNavBarData, updateNavBarData } from '../api';

const RADIX_PARSE_INT = 10

const EditNavBar =  ({ match }) => {
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
  const [itemPendingForDelete, setItemPendingForDelete] = useState(
    {
      id: '',
      type: '',
    }
  )
  const [resources, setResources] = useState()
  const [hasResources, setHasResources] = useState(false)
  const [hasResourceRoom, setHasResourceRoom] = useState(false)
  const [errors, setErrors] = useState({
    links: [],
    sublinks: [],
  })
  const [showDeletedText, setShowDeletedText] = useState(true)
  const [deletedLinks, setDeletedLinks] = useState('')

  const LinkCollectionSectionConstructor = () => ({
    title: 'Link Title',
    collection: collections[0],
  });
  
  const LinkResourceSectionConstructor = () => ({
    title: 'Link Title',
    resource_room: true,
  });

  const LinkPageSectionConstructor = () => ({
    title: 'Link Title',
    url: '/permalink',
  });

  const LinkSublinkSectionConstructor = () => ({
    title: 'Link Title',
    url: '/permalink',
    sublinks: [],
  });

  const SublinkSectionConstructor = () => ({
    title: 'Sublink Title',
    url: '/permalink'
  });

  const ErrorConstructor = () => ({
    title: '',
    url: ''
  });
  
  const enumSection = (type) => {
    switch (type) {
      case 'collectionLink':
        return LinkCollectionSectionConstructor();
      case 'resourceLink':
        return LinkResourceSectionConstructor();
      case 'pageLink':
        return LinkPageSectionConstructor();
      case 'sublinkLink':
        return LinkSublinkSectionConstructor();
      case 'sublink':
        return SublinkSectionConstructor();
      case 'error':
        return ErrorConstructor();
      default:
        return;
    }
  };

  // get nav bar data
  const { data: navigationContents } = useQuery(
    [NAVIGATION_CONTENT_KEY, siteName],
    () => getEditNavBarData(siteName),
    {
      retry: false,
      cacheTime: 0, // We want to refetch data on every page load because file order may have changed
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(`There was a problem trying to load your data. ${DEFAULT_RETRY_MSG}`)
        }
      }
    },
  );

  // update nav bar data
  const { mutateAsync: saveNavData } = useMutation(
    () => updateNavBarData(siteName, originalNav, links, sha),
    {
      onError: () => errorToast(`There was a problem trying to save your nav bar. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => window.location.reload(),
    },
  )

  // process nav bar data on mount
  useEffect(() => {
    let _isMounted = true;
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
        links: _.fill(Array(initialLinks.length), enumSection('error')),
        sublinks: [],
      }
      let deletedDisplayText = ''
      const filteredInitialLinks = []
      initialLinks.forEach((link, idx) => {
        let numSublinks = 0
        if ("sublinks" in link) {
          numSublinks = link.sublinks.length
        }
        if ('resource_room' in link) navHasResources = true
        if ('collection' in link && !(link.collection in foldersContent)) {
          // Invalid collection linked
          deletedDisplayText += `<br/>For link <code>${idx+1}</code>: <br/>`
          deletedDisplayText += `    <code>${link.collection}</code> has been removed</br>`
          return
        }
        filteredInitialLinks.push(link)
        initialDisplayLinks.push(false)
        initialDisplaySublinks.push(_.fill(Array(numSublinks), false))
        initialErrors.sublinks.push(_.fill(Array(numSublinks), enumSection('error')))
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
        if (resourceRoomName) setResources(initialResource.map(resource => deslugifyDirectory(resource.dirName)))
        setOriginalNav(navContent)
        setSha(navSha)
        setHasResources(navHasResources)
        setErrors(initialErrors)
        setDeletedLinks(deletedDisplayText)
      }
    }

    return () => {
      _isMounted = false;
    }
  }, [navigationContents])

  const onFieldChange = async (event) => {
    try {
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      switch (elemType) {
        case 'link': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2]
          const newLinks = update(links, {
            [linkIndex]: {
              [field]: {
                $set: value,
              },
            },
          });
          const newErrors = update(errors, {
            links: {
              [linkIndex]: {
                [field]: {
                  $set: validateLink(field, value)
                }
              }
            }
          })
          setLinks(newLinks)
          setErrors(newErrors)
          break;
        }
        case 'sublink': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const field = idArray[3]
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                [sublinkIndex] : {
                  [field]: {
                    $set: value,
                  },
                },
              },
            },
          });
          const newErrors = update(errors, {
            sublinks: {
              [linkIndex]: {
                [sublinkIndex]: {
                  [field]: {
                    $set: validateLink(field, value)
                  }
                }
              }
            }
          })
          setLinks(newLinks)
          setErrors(newErrors)
          break;
        }
        default: {
          return
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const createHandler = async (event) => {
    try {
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      switch (elemType) {
        case 'link': {
          const newLinks = update(links, {
            $push: [enumSection(value)]
          })
          if (value === 'resourceLink') setHasResources(true)
          const resetDisplayLinks = _.fill(Array(links.length), false)
          const resetDisplaySublinks = []
          links.forEach(link => {
            let numSublinks = 0
            if ("sublinks" in link) {
              numSublinks = link.sublinks.length
            }
            resetDisplaySublinks.push(_.fill(Array(numSublinks), false))
          })
          const newDisplayLinks = update(resetDisplayLinks, {
            $push: [true],
          });
          const newLinkErrors = update(errors, {
            links: {
              $push: [enumSection('error')],
            }
          })
          const newErrors = update(newLinkErrors, {
            sublinks: {
              $push: [[]]
            }
          })
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(resetDisplaySublinks)
          setErrors(newErrors)
          break
        }
        case 'sublink': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                $push: [enumSection(elemType)],
              },
            },
          })
          const resetDisplaySublinks = []
          links.forEach(link => {
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
          });
          const newErrors = update(errors, {
            sublinks: {
              [linkIndex]: {
                $push: [enumSection('error')],
              }
            }
          })
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split('-');
      const elemType = idArray[0];

      switch (elemType) {
        case 'link': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          if ('resource_room' in links[linkIndex]) setHasResources(false)
          const newLinks = update(links, {
            $splice: [[linkIndex, 1]]
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
            }
          })
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        case 'sublink': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                $splice: [[sublinkIndex, 1]]
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
            }
          })
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
          setErrors(newErrors)
          break
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  const displayHandler = async (event) => {
    try {
      const { id } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];
      switch (elemType) {
        case 'link': {
          const linkId = idArray[1];
          let resetDisplayLinks = _.fill(Array(links.length), false)
          resetDisplayLinks[linkId] = !displayLinks[linkId]
          const newDisplayLinks = update(displayLinks, {
            $set: resetDisplayLinks,
          });

          setDisplayLinks(newDisplayLinks)
          break;
        }
        case 'sublink': {
          const linkId = idArray[1];
          const sublinkId = idArray[2]
          let resetSublinkSections = _.fill(Array(displaySublinks[linkId].length), false)
          resetSublinkSections[sublinkId] = !displaySublinks[linkId][sublinkId]
          const newDisplaySublinks = update(displaySublinks, {
            [linkId]: {
              $set: resetSublinkSections,
            },
          });

          setDisplaySublinks(newDisplaySublinks)
          break;
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    switch (type) {
      case 'link': {
        const draggedLink = links[source.index]
        const newLinks = update(links, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedLink], // Splice elem into its new position
          ],
        })
        const displayLinkBool = displayLinks[source.index];
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
      } case 'sublink': {
        const idArray = source.droppableId.split('-');
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
            }
          }
        })
        setLinks(newLinks)
        setDisplaySublinks(newDisplaySublinks)
        setErrors(newErrors)
        break
      }
      default:
        return;
    }
  }

  const hasChanges = () => {
    return JSON.stringify(originalNav) !== JSON.stringify({
      ...originalNav,
      links: links
    })
  }

  const hasErrors = () => {
    return !isEmpty(errors.links) || !isEmpty(errors.sublinks)
  }

  return (
    <>
      { showDeletedText && !isEmpty(deletedLinks)
        && 
        <GenericWarningModal
          displayTitle="Removed content" 
          displayText={`Some of your content has been removed as they attempt to link to invalid folders. No changes are permanent unless you press Save on the next page.<br/>${deletedLinks}`}
          onProceed={()=>{setShowDeletedText(false)}}
          proceedText="Acknowledge"
        />
      }
      {
        itemPendingForDelete.id
        && (
        <DeleteWarningModal
          onCancel={() => setItemPendingForDelete({ id: null, type: '' })}
          onDelete={() => { deleteHandler(itemPendingForDelete.id); setItemPendingForDelete({ id: null, type: '' }); }}
          type={itemPendingForDelete.type}
        />
        )
      }
      <Header
        siteName={siteName}
        title={"Navigation Bar"}
        shouldAllowEditPageBackNav={!hasChanges()}
        isEditPage={true}
        backButtonText="Back to My Workspace"
        backButtonUrl={`/sites/${siteName}/workspace`}
      />
      { hasLoaded &&
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <DragDropContext onDragEnd={onDragEnd}>
                <NavSection
                  links={links}
                  options={options}
                  createHandler={createHandler}
                  deleteHandler={(event) => setItemPendingForDelete({ id: event.target.id, type: 'Link' })}
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
          <div className={`${editorStyles.contactUsEditorMain} ` }>
            {/* navbar content */}
            {/* TODO: update collectionInfo */}
            <TemplateNavBar
              links={links}
              collectionInfo={folderDropdowns}
              resources={resources}
            />
          </div>
          <div className={editorStyles.pageEditorFooter}>
            { !isEmpty(deletedLinks) && 
              <LoadingButton
                label="See removed content"
                className={`ml-auto ${elementStyles.warning}`}
                callback={() => {setShowDeletedText(true)}}
              />
            }
            <LoadingButton
              label="Save"
              disabled={hasErrors()} 
              disabledStyle={elementStyles.disabled}
              className={hasErrors() ? elementStyles.disabled : elementStyles.blue}
              callback={() => saveNavData(siteName, originalNav, links, sha)}
            />
          </div>
        </div>
      }
      {
          process.env.REACT_APP_ENV === 'LOCAL_DEV' && <ReactQueryDevtools initialIsOpen={false} />
      }
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
};
