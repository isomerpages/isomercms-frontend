import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';

import DeleteWarningModal from './DeleteWarningModal'
import GenericWarningModal from './GenericWarningModal'
import MenuDropdown from './MenuDropdown'

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  saveFileAndRetrieveUrl,
} from '../utils';
import {
  retrieveThirdNavOptions,
} from '../utils/dropdownUtils'
import { errorToast } from '../utils/toasts';


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
  date, category, settingsToggle, itemIndex, siteName, fileName, isResource, isHomepage, allCategories, resourceType
}) => {
  const dropdownRef = useRef(null)
  const fileMoveDropdownRef = useRef(null)
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowFileMoveDropdown, setCanShowFileMoveDropdown] = useState(false)
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const [canShowGenericWarningModal, setCanShowGenericWarningModal] = useState(false)
  const [chosenCategory, setChosenCategory] = useState()
  const [isNewCollection, setIsNewCollection] = useState(false)
  const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? isResource ? `/resources/${category}` : `/collections/${category}` : ''}`

  useEffect(() => {
    if (canShowFileMoveDropdown) fileMoveDropdownRef.current.focus()
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowFileMoveDropdown, canShowDropdown])

  const moveFile = async () => {
    try {
      // Retrieve data from existing page/resource
      const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

      const { content, sha } = resp.data;
      const base64DecodedContent = Base64.decode(content);
      const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
      const {
        title, permalink, file_url: fileUrl, third_nav_title: thirdNavTitle,
      } = frontMatter;

      let collectionPageData
      if (!isResource && !isNewCollection && chosenCategory) {
        // User selected an existing page collection
        const { collectionPages } = await retrieveThirdNavOptions(siteName, chosenCategory, true)
        collectionPageData = collectionPages
      }
      const fileInfo = {
        title,
        permalink,
        fileUrl,
        date,
        mdBody,
        sha,
        category: chosenCategory,
        originalCategory: category,
        type: isResource ? 'resource' : 'page',
        resourceType,
        originalThirdNavTitle: thirdNavTitle,
        fileName,
        isNewFile: false,
        siteName,
        collectionPageData,
        isNewCollection,
      }
      await saveFileAndRetrieveUrl(fileInfo)

      // Refresh page
      window.location.reload();
    } catch (err) {
      if (err?.response?.status === 409) {
        // Error due to conflict in name
        errorToast('This file name already exists in the category you are trying to move to. Please rename the file before proceeding.')
      } else {
        errorToast(`There was a problem trying to move this file. ${DEFAULT_RETRY_MSG}`)
      }
      setIsNewCollection(false)
      setCanShowGenericWarningModal(false)
      console.log(err);
    }
  }

  const deleteHandler = async () => {
    try {
      // Retrieve data from existing page/resource
      const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

      const { sha } = resp.data;
      const params = { sha };
      await axios.delete(`${baseApiUrl}/pages/${fileName}`, {
        data: params,
      });

      // Refresh page
      window.location.reload();
    } catch (err) {
      errorToast(`There was a problem trying to delete this file. ${DEFAULT_RETRY_MSG}`)
      console.log(err);
    }
  }
  
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
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCanShowFileMoveDropdown(false)
    }
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
      {settingsToggle &&
        <div className="position-relative mt-auto">
          <button 
            type="button"
            id={`settings-${itemIndex}`}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
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
                  handler: (e) => settingsToggle(e),
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
                  handler: toggleDropdownModals,
                },
                ...allCategories.map(categoryName => ({
                  itemName: categoryName,
                  itemId: categoryName,
                  handler: () => {
                    setChosenCategory(categoryName)
                    fileMoveDropdownRef.current.blur()
                    setCanShowGenericWarningModal(true)
                  },
                }))
              ]}
              setShowDropdown={canShowFileMoveDropdown}
              dropdownRef={fileMoveDropdownRef}
              menuIndex={''}
              tabIndex={1}
              handleBlur={handleBlur}
            />
          }
        </div>
      }
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
    {
      canShowGenericWarningModal &&
      <GenericWarningModal
        displayTitle="Warning"
        displayText="Moving a page to a different collection might lead to user confusion. You may wish to change the permalink for this page afterwards."
        onProceed={moveFile}
        onCancel={() => {
          setChosenCategory()
          setIsNewCollection(false)
          setCanShowGenericWarningModal(false)
        }}
        proceedText="Continue"
        cancelText="Cancel"
      />
    }
    {
      canShowDeleteWarningModal
      && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
          type={isResource ? "resource" : "page"}
        />
      )
    }
    </>
  );
};


OverviewCard.propTypes = {
  date: PropTypes.string,
  category: PropTypes.string,
  settingsToggle: PropTypes.func,
  itemIndex: PropTypes.number.isRequired,
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isResource: PropTypes.bool,
};

export default OverviewCard