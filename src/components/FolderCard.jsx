import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import FolderModal from './FolderModal';
import DeleteWarningModal from './DeleteWarningModal'

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// axios settings
axios.defaults.withCredentials = true

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  isHomepage,
  isCollection,
  siteName,
  category,
}) => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowDropdown])
  
  const generateLink = () => {
    if (isHomepage) return `/sites/${siteName}/homepage`
    if (isCollection) return `/sites/${siteName}/collections/${category}`
    return `/sites/${siteName}/resources/${category}`
  }

  const MenuItem = ({handler, id, children}) => {
    return (
      <div
        id={id}
        onClick={(e) => {
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
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${isCollection ? `collections/${category}` : `resources/${category}`}`
      await axios.delete(apiUrl);

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      { isFolderModalOpen &&
        <FolderModal
          displayTitle={isCollection ? 'Rename Collection' : 'Rename Resource Category'}
          displayText={isCollection ? 'Collection name' : "Resource category name"}
          onClose={() => setIsFolderModalOpen(false)}
          category={category}
          siteName={siteName}
          isCollection={isCollection}
        />
      }
      { canShowDeleteWarningModal &&
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
          type="folder"
        />
      }
      <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`} to={generateLink()}>
        <div id={itemIndex} className={`${contentStyles.folderInfo}`}>
          <i className={`bx bx-md text-dark ${isHomepage ? 'bxs-home-circle' : 'bxs-folder'} ${contentStyles.componentIcon}`} />
          <span className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}>{displayText}</span>
          {
            isHomepage
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
                  className={contentStyles.componentIcon}
                >
                  <i id={`settingsIcon-${itemIndex}`} className="bx bx-dots-vertical-rounded" />
                </button>
              { canShowDropdown &&
                <div className={`position-absolute ${elementStyles.dropdown}`} ref={dropdownRef} tabIndex={2} onBlur={()=>setCanShowDropdown(false)}>
                  <MenuItem handler={(e) => {dropdownRef.current.blur(); setIsFolderModalOpen(true)}} id={`folderSettings-${itemIndex}`}>
                    <i id={`settingsIcon-${itemIndex}`} className="bx bx-sm bx-edit"/>
                    <div className={elementStyles.dropdownText}>Rename</div>
                  </MenuItem>
                  <MenuItem handler={() => {dropdownRef.current.blur(); setCanShowDeleteWarningModal(true)}} id={`folderDelete-${itemIndex}`}>
                    <i className="bx bx-sm bx-trash text-danger"/>
                    <div className={elementStyles.dropdownText}>Delete folder</div>
                  </MenuItem>
                </div>
              }
              </div>
            )
          }
        </div>
      </Link>
    </>
  )
}

FolderCard.propTypes = {
  displayText: PropTypes.string.isRequired,
  settingsToggle: PropTypes.func.isRequired,
  itemIndex: PropTypes.number,
  isHomepage: PropTypes.bool.isRequired,
  isCollection: PropTypes.bool.isRequired,
  siteName: PropTypes.string.isRequired,
};

export default FolderCard;