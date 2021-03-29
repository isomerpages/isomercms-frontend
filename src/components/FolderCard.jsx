import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import FolderModal from './FolderModal';
import DeleteWarningModal from './DeleteWarningModal'
import MenuDropdown from './MenuDropdown'

import { errorToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import { DEFAULT_RETRY_MSG } from '../utils'

// axios settings
axios.defaults.withCredentials = true

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  pageType,
  siteName,
  category,
  selectedIndex,
  onClick,
}) => {
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

  const deleteHandler = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${pageType === 'collection' ? `/collections/${category}` : `/resources/${category}`}`
      await axios.delete(apiUrl);

      // Refresh page
      window.location.reload();
    } catch (err) {
      errorToast(`There was a problem trying to delete this folder. ${DEFAULT_RETRY_MSG}`)
      console.log(err);
    }
  }

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
          displayTitle={pageType === 'collection' ? 'Rename Collection' : 'Rename Resource Category'}
          displayText={pageType === 'collection' ? 'Collection name' : "Resource category name"}
          onClose={() => setIsFolderModalOpen(false)}
          folderOrCategoryName={category}
          siteName={siteName}
          isCollection={pageType === 'collection'}
        />
      }
      { canShowDeleteWarningModal &&
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
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
};

export default FolderCard;