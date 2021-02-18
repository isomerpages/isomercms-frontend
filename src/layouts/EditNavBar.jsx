import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext } from 'react-beautiful-dnd';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';

import { DEFAULT_ERROR_TOAST_MSG, deslugifyDirectory } from '../utils';

import Toast from '../components/Toast';
import NavSection from '../components/navbar/NavSection'
import TemplateNavBar from '../templates/NavBar'

import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';

import Header from '../components/Header';
import LoadingButton from '../components/LoadingButton';

import DeleteWarningModal from '../components/DeleteWarningModal';

const RADIX_PARSE_INT = 10

const EditNavBar =  ({ match }) => {
  const { siteName } = match.params

  const [sha, setSha] = useState()
  const [links, setLinks] = useState([])
  const [originalNav, setOriginalNav] = useState()
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
  const [resources, setResources] = useState()


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
      default:
        return;
    }
  };

  useEffect(() => {
    let _isMounted = true

    const loadNavBarDetails = async () => {
      let navContent, collectionContent, resourceContent, navSha
      try {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/navigation`);
        const { content, sha } = resp.data;
        navContent = content
        navSha = sha
        const collectionResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`)
        collectionContent = collectionResp.data
        const resourceResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`)
        resourceContent = resourceResp.data
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

      if (!navContent) return

      const { links } = navContent

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
      const { resources } = resourceContent

      const options = collections.map((collection) => ({
        value: collection,
        label: collection,
      }))

      if (_isMounted) {
        setLinks(links)
        setHasLoaded(true)
        setDisplayLinks(displayLinks)
        setDisplaySublinks(displaySublinks)
        setCollections(collections)
        setOptions(options)
        setResources(resources.map(resource => deslugifyDirectory(resource.dirName)))
        setOriginalNav(navContent)
        setSha(navSha)
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
          const newLinks = update(links, {
            [linkIndex]: {
              [field]: {
                $set: value,
              },
            },
          });
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
            $push: [enumSection(value)]
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
                $splice: [[sublinkIndex, 1]]
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

  const saveNav = async () => {
    try {
      const params = {
        content: {
          ...originalNav,
          links
        },
        sha: sha,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/navigation`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to save your nav bar. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
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
        const draggedSublink = links[linkIndex].sublinks[source.index]
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
    return JSON.stringify(originalNav) !== JSON.stringify({
      ...originalNav,
      links: links
    })
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
        shouldAllowEditPageBackNav={!hasChanges()}
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
              collectionInfo={null}
              resources={resources}
            />
          </div>
          <div className={editorStyles.pageEditorFooter}>
            {/* TODO: save button */}
            <LoadingButton
              label="Save"
              disabledStyle={elementStyles.disabled}
              className={elementStyles.blue}
              callback={saveNav}
            />
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
