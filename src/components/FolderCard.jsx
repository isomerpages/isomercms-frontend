import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import FolderModal from './FolderModal';
import DeleteWarningModal from './DeleteWarningModal'
import { toast } from 'react-toastify';
import Toast from './Toast';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import {
  DEFAULT_ERROR_TOAST_MSG,
  checkIsOutOfViewport,
} from '../utils'

// axios settings
axios.defaults.withCredentials = true

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  pageType,
  siteName,
  category,
  folderStyle,
  onClick,
}) => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const [isOutOfViewport, setIsOutOfViewport] = useState()
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (canShowDropdown) {
      dropdownRef.current.focus()
      if (isOutOfViewport === undefined) {
        // We only want to run this once
        const bounding = dropdownRef.current.getBoundingClientRect()
        setIsOutOfViewport(checkIsOutOfViewport(bounding, ['right']))
      }
    }
  }, [canShowDropdown])
  
  const generateLink = () => {
    switch(pageType) {
      case 'homepage': 
        return `/sites/${siteName}/homepage`
      case 'collection':
        return `/sites/${siteName}/collections/${category}`
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

  const MenuItem = ({handler, id, children}) => {
    return (
      <div
        id={id}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault(); 
          if (handler) handler(e);
        }}
        className={`${elementStyles.dropdownItem}`}
      >
        {children}
      </div>
    )
  }

  const deleteHandler = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${pageType === 'collection' ? `/collections/${category}` : `/resources/${category}`}`
      await axios.delete(apiUrl);

      // Refresh page
      window.location.reload();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to delete this folder. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
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
          <div className={`position-relative`}>
            <button
              className={contentStyles.componentIcon}
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
            <div className={`${elementStyles.dropdown} ${isOutOfViewport && elementStyles.right}`} ref={dropdownRef} tabIndex={2} onBlur={()=>setCanShowDropdown(false)}>
              { isOutOfViewport !== undefined && 
                <>
                  <MenuItem handler={(e) => {dropdownRef.current.blur(); setIsFolderModalOpen(true)}} id={`folderSettings-${itemIndex}`}>
                    <i id={`settingsIcon-${itemIndex}`} className="bx bx-sm bx-edit"/>
                    <div className={elementStyles.dropdownText}>Rename</div>
                  </MenuItem>
                  <MenuItem handler={() => {dropdownRef.current.blur(); setCanShowDeleteWarningModal(true)}} id={`folderDelete-${itemIndex}`}>
                    <i className="bx bx-sm bx-trash text-danger"/>
                    <div className={elementStyles.dropdownText}>Delete folder</div>
                  </MenuItem>
                </>
              }
            </div>
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
          category={category}
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
          <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard} ${folderStyle}`} to={generateLink()}>
            {FolderCardContent()}
          </Link>
        :
        <div className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard} ${folderStyle}`} onClick={onClick}>
          {FolderCardContent()}
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