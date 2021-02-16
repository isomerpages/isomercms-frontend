import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext } from 'react-beautiful-dnd';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';

import { DEFAULT_ERROR_TOAST_MSG, SINGLE_PAGE_IDENTIFIER, SUBLINK_IDENTIFIER, RESOURCE_ROOM_IDENTIFIER } from '../utils';

import Toast from '../components/Toast';
import NavSection from '../components/navbar/NavSection'

import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';

import Header from '../components/Header';
import LoadingButton from '../components/LoadingButton';

import DeleteWarningModal from '../components/DeleteWarningModal';

const RADIX_PARSE_INT = 10

const EditNavBar =  ({ match }) => {
  const { siteName } = match.params

  const [links, setLinks] = useState([])
  const [collections, setCollections] = useState([])
  const [options, setOptions] = useState([])
  const [displayLinks, setDisplayLinks] = useState([])
  const [displaySublinks, setDisplaySublinks] = useState([])
  const [shouldRedirectToNotFound, setShouldRedirectToNotFound] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [itemPendingForDelete, setItemPendingForDelete] = useState(
    {
      id: '',
      type: '',
    }
  )
  const [resourceRoomName, setResourceRoomName] = useState('')


  const LinkSectionConstructor = () => ({
    title: 'Link Title',
    collection: collections[0],
  });
  
  const SublinkSectionConstructor = () => ({
    title: 'Sublink Title',
    url: ''
  });
  
  const enumSection = (type) => {
    switch (type) {
      case 'link':
        return LinkSectionConstructor();
      case 'sublink':
        return SublinkSectionConstructor();
      default:
        return;
    }
  };

  useEffect(() => {
    let _isMounted = true

    const loadNavBarDetails = async () => {
      let content, collectionContent, resourceRoomContent
      try {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/navigation`);
        content = resp.data;
        const collectionResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`)
        collectionContent = collectionResp.data
        const resourceRoomResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resource-room`)
        resourceRoomContent = resourceRoomResp.data
      } catch (error) {
        if (error?.response?.status === 404) {
          setShouldRedirectToNotFound(true)
        } else {
          toast(
            <Toast notificationType='error' text={`There was a problem trying to load your data. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
            {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
          );
        }
        console.log(error)
      }

      if (!content) return

      const { links } = content

      // Add booleans for displaying links and sublinks
      const displayLinks = _.fill(Array(links.length), false)
      const displaySublinks = []
      links.forEach(link => {
        let numSublinks = 0
        if ("sublinks" in link) {
          numSublinks = link.sublinks.length
        }
        displaySublinks.push(_.fill(Array(numSublinks), false))
      })

      const { collections } = collectionContent
      const { resourceRoom } = resourceRoomContent

      const options = collections.map((collection) => ({
        value: collection,
        label: collection,
      }))
      options.push({
        value: RESOURCE_ROOM_IDENTIFIER,
        label: resourceRoom,
      })
      options.push({
        value: SUBLINK_IDENTIFIER,
        label: 'Create Sublinks',
      })
      options.push({
        value: SINGLE_PAGE_IDENTIFIER,
        label: 'Single Page',
      })

      if (_isMounted) {
        setLinks(links)
        setHasLoaded(true)
        setDisplayLinks(displayLinks)
        setDisplaySublinks(displaySublinks)
        setCollections(collections)
        setOptions(options)
        setResourceRoomName(resourceRoom)
      }
    }

    loadNavBarDetails()

    return () => {
      _isMounted = false
    }
  }, [])

  const onFieldChange = async (event) => {
    try {
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      switch (elemType) {
        case 'link': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2]
          let newLinks
          // Collection field can modify different fields
          if (field === 'collection') {
            const resetLinks = update(links, {
              [linkIndex]: {
                $unset: ['collection', 'resource_room', 'sublinks', 'url']
              },
            });
            switch (value) {
              case RESOURCE_ROOM_IDENTIFIER: {
                newLinks = update(resetLinks, {
                  [linkIndex]: {
                    resource_room: {
                      $set: true,
                    },
                  },
                });
                break;
              }
              case SUBLINK_IDENTIFIER: {
                newLinks = update(resetLinks, {
                  [linkIndex]: {
                    sublinks: {
                      $set: [],
                    },
                  },
                });
                break;
              }
              case SINGLE_PAGE_IDENTIFIER: {
                newLinks = update(resetLinks, {
                  [linkIndex]: {
                    url: {
                      $set: '/permalink',
                    },
                  },
                });
                break;
              }
              default: {
                // Regular collection
                newLinks = update(resetLinks, {
                  [linkIndex]: {
                    [field]: {
                      $set: value,
                    },
                  },
                });
              }
            }
          } else {
            newLinks = update(links, {
              [linkIndex]: {
                [field]: {
                  $set: value,
                },
              },
            });
          }
          console.log(newLinks)
          setLinks(newLinks)
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
          setLinks(newLinks)
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
            $push: [enumSection(elemType)]
          })
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
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(resetDisplaySublinks)
          break
        }
        case 'sublink': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                [sublinkIndex] : {
                  $push: [enumSection(elemType)],
                },
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
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
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
          const newLinks = update(links, {
            $splice: [[linkIndex, 1]]
          })
          const newDisplayLinks = update(displayLinks, {
            $splice: [[linkIndex, 1]],
          })
          const newDisplaySublinks = update(displaySublinks, {
            $splice: [[linkIndex, 1]],
          })
          setLinks(newLinks)
          setDisplayLinks(newDisplayLinks)
          setDisplaySublinks(newDisplaySublinks)
          break
        }
        case 'sublink': {
          const linkIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sublinkIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const newLinks = update(links, {
            [linkIndex]: {
              sublinks: {
                [sublinkIndex] : {
                  $splice: [[sublinkIndex, 1]]
                },
              },
            },
          })
          const newDisplaySublinks = update(displaySublinks, {
            [linkIndex]: {
              $splice: [[sublinkIndex, 1]],
            },
          })
          setLinks(newLinks)
          setDisplaySublinks(newDisplaySublinks)
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
          resetSublinkSections[sublinkId] = !displaySublinks[sublinkId]
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

  const saveNav = async () => {
    // TODO
  }

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    console.log(source)
    console.log(destination)
    console.log(type)

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    let newSections = [];
    let newErrors = [];

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
        setLinks(newLinks)
        setDisplayLinks(newDisplayLinks)
        setDisplaySublinks(newDisplaySublinks)
        break
      } case 'sublink': {
        const idArray = source.droppableId.split('-');
        const linkIndex = idArray[1]
        const draggedSublink = links[linkIndex][source.index]
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
        setLinks(newLinks)
        setDisplaySublinks(newDisplaySublinks)
        break
      }
      default:
        return;
    }
  }

  const hasChanges = () => {
    // TODO
    // return JSON.stringify(sanitisedOriginalFrontMatter) === JSON.stringify(frontMatter) && JSON.stringify(footerContent) === JSON.stringify(originalFooterContent)
    return false
  }

  return (
    <>
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
        title={"Nav Bar"}
        shouldAllowEditPageBackNav={hasChanges()}
        isEditPage="true"
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
                  resourceRoomName={resourceRoomName}
                />
              </DragDropContext>
            </div>
          </div>
          <div className={`${editorStyles.contactUsEditorMain} ` }>
            {/* navbar content */}
            <section className="bp-section is-small padding--bottom--lg">
              <div className="bp-container">
                <div className="row">
                  <div className="col is-8 is-offset-2">
                    {/* TODO: display menu */}
                    MENU
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={editorStyles.pageEditorFooter}>
            {/* TODO: save button */}
            SAVE
          </div>
        </div>
      }
      {
        shouldRedirectToNotFound &&
        <Redirect
          to={{
              pathname: '/not-found',
              state: {siteName: siteName}
          }}
        />
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
