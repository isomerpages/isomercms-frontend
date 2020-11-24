import React, { useEffect, useState, useRef } from 'react';
import DeleteWarningModal from './DeleteWarningModal'
import LoadingButton from './LoadingButton'
import {
  frontMatterParser,
  saveFileAndRetrieveUrl,
} from '../utils';
import {
  retrieveThirdNavOptions,
} from '../utils/dropdownUtils'
import {
  validateCategoryName,
} from '../utils/validators'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import {
  prettifyCollectionPageFileName,
  prettifyPageFileName,
  retrieveResourceFileMetadata,
} from '../utils';

// axios settings
axios.defaults.withCredentials = true

const OverviewCard = ({
  date, category, settingsToggle, itemIndex, siteName, fileName, isResource, isHomepage, allCategories
}) => {
  const dropdownRef = useRef(null)
  const fileMoveDropdownRef = useRef(null)
  const categoryInputRef = useRef(null)
  const [newCategory, setNewCategory] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowFileMoveDropdown, setCanShowFileMoveDropdown] = useState(false)
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? isResource ? `/resources/${category}` : `/collections/${category}` : ''}`

  useEffect(() => {
    if (canShowFileMoveDropdown) fileMoveDropdownRef.current.focus()
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowFileMoveDropdown, canShowDropdown])

  const moveFile = async (chosenCategory) => {
    try {
      // Retrieve data from existing page/resource
      const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

      const { content, sha } = resp.data;
      const base64DecodedContent = Base64.decode(content);
      const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
      const {
        title, permalink, file_url: fileUrl, date, third_nav_title: thirdNavTitle,
      } = frontMatter;

      let collectionPageData
      if (!isResource && chosenCategory) {
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
        category: chosenCategory ? chosenCategory : newCategory,
        originalCategory: category,
        type: isResource ? 'resource' : 'page',
        originalThirdNavTitle: thirdNavTitle,
        fileName,
        isNewFile: false,
        siteName,
        collectionPageData,
        isNewCollection: !chosenCategory,
      }
      await saveFileAndRetrieveUrl(fileInfo)

      // Refresh page
      window.location.reload();
    } catch (err) {
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
      console.log(err);
    }
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

  const changeHandler = (event) => {
    const { value } = event.target;

    const errorMessage = validateCategoryName(value, isResource ? 'resource' : 'page')

    if (errorMessage === '' && allCategories && allCategories.includes(value)) {
      setErrorMessage('This category name is already in use. Please choose a different one.')
      setNewCategory(value)
    } else {
      setErrorMessage(errorMessage)
      setNewCategory(value)
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
  
  return (
    <>
    <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`} to={generateLink()}>
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <div className={contentStyles.componentCategory}>{category ? category : ''}</div>
        <h1 className={contentStyles.componentTitle}>{generateTitle()}</h1>
        <p className={contentStyles.componentDate}>{date ? date : ''}</p>
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
            className={`${contentStyles.componentIcon}`}
          >
            <i id={`settingsIcon-${itemIndex}`} className="bx bx-dots-vertical-rounded" />
          </button>
          {canShowDropdown &&
            <div className={`position-absolute ${elementStyles.dropdown}`} ref={dropdownRef} tabIndex={2} onBlur={()=>setCanShowDropdown(false)}>
              <MenuItem handler={(e) => {dropdownRef.current.blur(); settingsToggle(e)}} id={`settings-${itemIndex}`}>
                <i id={`settingsIcon-${itemIndex}`} className="bx bx-sm bx-edit"/>
                <div id={`settingsText-${itemIndex}`} className={elementStyles.dropdownText}>Edit details</div>
              </MenuItem>
              <MenuItem handler={toggleDropdownModals}>
                <i className="bx bx-sm bx-folder"/>
                <div className={elementStyles.dropdownText}>Move to</div>
                <i className="bx bx-sm bx-chevron-right ml-auto"/>
              </MenuItem>
              <MenuItem handler={() => {dropdownRef.current.blur(); setCanShowDeleteWarningModal(true)}}>
                <i className="bx bx-sm bx-trash text-danger"/>
                <div className={elementStyles.dropdownText}>Delete item</div>
              </MenuItem>
          </div>}
          {canShowFileMoveDropdown &&
            <div className={`position-absolute ${elementStyles.dropdown}`} ref={fileMoveDropdownRef} tabIndex={1} onBlur={handleBlur}>
              <MenuItem className={`d-flex`} handler={toggleDropdownModals}>
                <i className="bx bx-sm bx-arrow-back"/>
                <div className={elementStyles.dropdownText}>Move to</div>
              </MenuItem>
              <hr/>
              {category && !isResource &&
                <MenuItem handler={() => moveFile('')}>
                  <div className={elementStyles.dropdownText}>Unlinked Page</div>
                </MenuItem>
              }
              {allCategories
                ?
                allCategories.map((categoryName) => {
                  if (categoryName !== category) {
                    return (
                      <MenuItem key={categoryName} handler={() => moveFile(categoryName)}>
                        <div className={elementStyles.dropdownText}>{categoryName}</div>
                      </MenuItem>
                    )
                  }
                  return null
                })
                :
                  `Loading Categories...`
              }
              <hr/>
              <div className={`d-flex text-nowrap ${elementStyles.dropdownItem}`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
                <i className="bx bx-sm bx-folder-plus" />
                <input
                  type="text"
                  placeholder={'Create new category'}
                  value={newCategory}
                  id={'categoryName'}
                  className={errorMessage ? `${elementStyles.error}` : null}
                  onChange={changeHandler}
                  ref={categoryInputRef}
                />
                <LoadingButton
                  label="Submit"
                  disabled={!!errorMessage || !newCategory}
                  disabledStyle={elementStyles.disabled}
                  className={(!!errorMessage || !newCategory) ? elementStyles.disabled : elementStyles.blue}
                  callback={moveFile}
                />
              </div>
              { errorMessage &&
                <div className={`d-flex ${elementStyles.dropdownItemWarning}`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
                  <span className={elementStyles.error}>{errorMessage}</span>
                </div>
              }
          </div>}
        </div>
      }
    </Link>
    {
      canShowDeleteWarningModal
      && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
          type="resource"
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