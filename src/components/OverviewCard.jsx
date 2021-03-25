import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import PropTypes from 'prop-types';
import MenuDropdown from './MenuDropdown'

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import {
  prettifyCollectionPageFileName,
  prettifyPageFileName,
  prettifyDate,
  retrieveResourceFileMetadata,
} from '../utils';

// axios settings
axios.defaults.withCredentials = true

const OverviewCard = ({
  date, 
  category, 
  itemIndex, 
  siteName, 
  fileName, 
  isResource, 
  isHomepage, 
  allCategories, 
  resourceType,
  setIsComponentSettingsActive,
  setSelectedFile,
  setSelectedPath,
  setCanShowDeleteWarningModal,
  setCanShowMoveModal,
  queryFolderName,
  setQueryFolderName,
}) => {
  const dropdownRef = useRef(null)
  const fileMoveDropdownRef = useRef(null)
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowFileMoveDropdown, setCanShowFileMoveDropdown] = useState(false)

  useEffect(() => {
    if (canShowFileMoveDropdown) fileMoveDropdownRef.current.focus()
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowFileMoveDropdown, canShowDropdown])

  const generateLink = () => {
    if (isResource) {
      return `/sites/${siteName}/resources/${category}/${fileName}`
    } else if (isHomepage) {
      return `/sites/${siteName}/homepage`
    } else {
      if (category) {
        return `/sites/${siteName}/collections/${category}/${fileName}`
      } else {
        return `/sites/${siteName}/pages/${fileName}`
      }
    }
  }

  const generateTitle = () => {
    let title
    if (isResource) {
      title = retrieveResourceFileMetadata(fileName).title
    } else {
      if (category) {
        title = prettifyCollectionPageFileName(fileName)
      } else {
        title = prettifyPageFileName(fileName)
      }
    }
    return title
  }

  const handleBlur = (event) => {
    // if the blur was because of outside focus
    // currentTarget is the parent element, relatedTarget is the clicked element
    // if (!event.currentTarget.contains(event.relatedTarget)) {
    //   setCanShowFileMoveDropdown(false)
    // }
  }

  const toggleDropdownModals = () => {
    setCanShowFileMoveDropdown(!canShowFileMoveDropdown)
    setCanShowDropdown(!canShowDropdown)
  }

  const CardContent = (
    <>
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <div className={contentStyles.componentCategory}>{category ? category : ''}</div>
        <h1 className={contentStyles.componentTitle}>{generateTitle()}</h1>
        <p className={contentStyles.componentDate}>{`${date ? prettifyDate(date) : ''}${resourceType ? `/${resourceType.toUpperCase()}` : ''}`}</p>
      </div>
        <div className="position-relative mt-auto">
          <button 
            type="button"
            id={`settings-${itemIndex}`}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedFile(fileName)
                setCanShowDropdown(true)
              }}
            className={`${canShowDropdown || canShowFileMoveDropdown ? contentStyles.optionsIconFocus : contentStyles.optionsIcon}`}
          >
            <i id={`settingsIcon-${itemIndex}`} className="bx bx-dots-vertical-rounded" />
          </button>
          { canShowDropdown &&
            <MenuDropdown 
              dropdownItems={[
                {
                  type: 'edit',
                  handler: () => setIsComponentSettingsActive((prevState) => !prevState),
                },
                {
                  type: 'move',
                  handler: toggleDropdownModals,
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
          { canShowFileMoveDropdown &&
            <MenuDropdown 
              dropdownItems={[
                {
                  itemName: 'Move to',
                  itemId: `move`,
                  iconClassName: "bx bx-sm bx-arrow-back",
                  handler: () => toggleDropdownModals(queryFolderName),
                },
                ...allCategories.map(categoryName => ({
                  itemName: categoryName,
                  itemId: categoryName,
                  handler: () => {
                    setSelectedPath(`${queryFolderName ? `${queryFolderName}/` : ''}${categoryName}`)
                    fileMoveDropdownRef.current.blur()
                    setCanShowMoveModal(true)
                  },
                  children: !isResource && queryFolderName === '' && <button
                      id={`${categoryName}-more`}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); setQueryFolderName(categoryName)}}
                      className={elementStyles.dropdownItemChildButton}
                  >
                      <i className="bx bx-sm bx-chevron-right ml-auto"/>   
                  </button>,
                })),
              ]}
              setShowDropdown={canShowFileMoveDropdown}
              dropdownRef={fileMoveDropdownRef}
              menuIndex={''}
              tabIndex={1}
              onBlur={handleBlur}
            />
          }
        </div>
    </>
  )
  
  return (
    <>
    {
      resourceType !== 'file'
      ?
        <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`} to={generateLink()}>
          {CardContent}
        </Link>
      : <div className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`}>
          {CardContent}
        </div>
    }
    </>
  );
};


OverviewCard.propTypes = {
  date: PropTypes.string,
  category: PropTypes.string,
  itemIndex: PropTypes.number.isRequired,
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isResource: PropTypes.bool,
};

export default OverviewCard