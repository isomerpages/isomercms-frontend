import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQueryClient, useMutation } from 'react-query';

import FolderModal from './FolderModal';
import DeleteWarningModal from './DeleteWarningModal'
import { MenuDropdown } from './MenuDropdown'

import {
  deleteFolder,
  deleteResourceCategory,
  deleteMediaSubfolder,
} from '../api'


import { errorToast, successToast } from '../utils/toasts';
import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY, FOLDERS_CONTENT_KEY, RESOURCE_ROOM_CONTENT_KEY } from '../constants';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import { DEFAULT_RETRY_MSG } from '../utils'

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  pageType,
  siteName,
  category,
  selectedIndex,
  linkPath,
  onClick,
  existingFolders,
  mediaCustomPath,
}) => {
  // Instantiate queryClient
  const queryClient = useQueryClient()
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowDropdown])
  
  const generateLink = () => {
    switch(pageType) {
      case 'homepage': 
        return `/sites/${siteName}/homepage`
      case 'collection':
        return `/sites/${siteName}/folder/${category}`
      case 'resources':
        return `/sites/${siteName}/resources/${category}`
      case 'contact-us':
        return `/sites/${siteName}/contact-us`
      case 'nav':
        return `/sites/${siteName}/navbar`
      case 'images':
      case 'documents':
        return `/sites/${siteName}/${linkPath}`
      default:
        return ''
    }
  }

  const generateImage = (pageType) => {
    switch(pageType) {
      case 'homepage':
        return 'bxs-home-circle'
      case 'contact-us':
        return 'bxs-phone'
      case 'nav':
        return 'bxs-compass'
      case 'file':
        return 'bxs-file-blank'
      default: 
        return 'bxs-folder'
    }
  }

  const getFolderType = (pageType) => {
    switch(pageType) {
      case 'collection':
        return 'page'
      case 'images':
        return 'images'
      case 'documents':
        return 'documents'
      default:
        return 'resources'
    }
  }

  const selectDeleteApiCall = (pageType, siteName, category, mediaCustomPath) => {
    let params
    switch(pageType) {
      case 'collection':
        params = {
          siteName,
          folderName: category,
        }
        return deleteFolder(params)
      case 'resources':
        params = {
          siteName,
          categoryName: category,
        }
        return deleteResourceCategory(params)
      case 'images':
      case 'documents':
        params = {
          siteName,
          mediaType: pageType,
          customPath: `${mediaCustomPath ? `${mediaCustomPath}/` : ''}${category}`,
        }
        return deleteMediaSubfolder(params)
    }
  }

  // delete folder/resource category
  const { mutateAsync: deleteDirectory } = useMutation(
    () => selectDeleteApiCall(pageType, siteName, category, mediaCustomPath),
    {
      onError: () => errorToast(`There was a problem trying to delete this folder. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => {
        if (pageType === "resources") {
          // Resource folder
          queryClient.invalidateQueries([RESOURCE_ROOM_CONTENT_KEY, siteName])
        } else if (pageType === "collection") {
          // Collection folder
          queryClient.invalidateQueries([FOLDERS_CONTENT_KEY, { siteName, isResource: false }])
        } else if (pageType === "images") {
          queryClient.invalidateQueries([IMAGE_CONTENTS_KEY, mediaCustomPath])
        } else if (pageType === "documents") {
          queryClient.invalidateQueries([DOCUMENT_CONTENTS_KEY, mediaCustomPath])
        }
        setCanShowDeleteWarningModal(false)
        successToast(`Successfully deleted folder!`)
      },
    },
  )

  const FolderCardContent = () =>
    <div id={itemIndex} className={`${contentStyles.folderInfo}`}>
      <i className={`bx bx-md text-dark ${generateImage(pageType)} ${contentStyles.componentIcon}`} />
      <span className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}>{displayText}</span>
      {
        pageType === 'homepage' || pageType === 'contact-us' || pageType === 'nav' || pageType === 'file'
        ? ''
        : (
          <div className={`position-relative mt-auto mb-auto`}>
            <button
              className={`${canShowDropdown ? contentStyles.optionsIconFocus : contentStyles.optionsIcon}`}
              type="button"
              id={`settings-folder-${itemIndex}`}
              onClick={(e) => {
                e.preventDefault();
                settingsToggle(e);
                setCanShowDropdown(true)
              }}
            >
              <i id={`settingsIcon-${itemIndex}`} className="bx bx-dots-vertical-rounded" />
            </button>
            { canShowDropdown &&
              <MenuDropdown 
                dropdownItems={[
                  {
                    type: "edit",
                    handler: () => setIsFolderModalOpen(true),
                  },
                  {
                    type: 'delete',
                    handler: () => setCanShowDeleteWarningModal(true)
                  },
                ]}
                dropdownRef={dropdownRef}
                menuIndex={itemIndex}
                tabIndex={2}
                onBlur={()=>setCanShowDropdown(false)}
              />
            }
          </div>
        )
      }
    </div>

  return (
    <>
      { isFolderModalOpen &&
        <FolderModal
          displayTitle={pageType === 'collection' ? 'Rename Folder' : 'Rename Category'}
          displayText={pageType === 'collection' ? 'Folder name' : "Category name"}
          onClose={() => setIsFolderModalOpen(false)}
          folderOrCategoryName={category}
          siteName={siteName}
          folderType={getFolderType(pageType)}
          existingFolders={existingFolders}
          mediaCustomPath={mediaCustomPath}
        />
      }
      { canShowDeleteWarningModal &&
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteDirectory}
          type="folder"
        />
      }
      {generateLink() 
        ? 
          <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`} to={generateLink()}>
            {FolderCardContent()}
          </Link>
        :
        <div className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard} ${selectedIndex ? `border border-primary` : ''}`} onClick={onClick}>
          {FolderCardContent()}
          { selectedIndex &&
            <div className={elementStyles.orderCircleContainer}>
              <div className={elementStyles.orderCircle}>{selectedIndex}</div>
            </div>
          }
          
        </div>
      }
    </>
  )
}

FolderCard.propTypes = {
  displayText: PropTypes.string.isRequired,
  settingsToggle: PropTypes.func.isRequired,
  itemIndex: PropTypes.number,
  pageType: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  category: PropTypes.string,
  linkPath: PropTypes.string,
  mediaCustomPath: PropTypes.string,
};

export default FolderCard;