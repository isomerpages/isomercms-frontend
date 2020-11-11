import React, { useEffect, useState, useRef } from 'react';
import {
  frontMatterParser,
  saveFileAndRetrieveUrl,
} from '../utils';
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
  date, category, settingsToggle, itemIndex, siteName, fileName, isResource, isHomepage
}) => {
  const dropdownRef = useRef(null)
  const fileMoveDropdownRef = useRef(null)
  const categoryInputRef = useRef(null)
  const [allCategories, setAllCategories] = useState()
  const [newCategory, setNewCategory] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [canShowDropdown, setCanShowDropdown] = useState(false)
  const [canShowFileMoveDropdown, setCanShowFileMoveDropdown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve the list of all page/resource categories for use in the dropdown options.
      if (isResource) {
        const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
        const { resources: allCategories } = resourcesResp.data;
        setAllCategories(allCategories.map((category) => category.dirName))
      } else {
        const collectionsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`);
        const { collections: collectionCategories } = collectionsResp.data;
        setAllCategories(collectionCategories)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (canShowFileMoveDropdown) fileMoveDropdownRef.current.focus()
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowFileMoveDropdown, canShowDropdown])

  const moveFile = async (event) => {
    try {
      const { value: newCategory } = event.target;
      const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? isResource ? `/resources/${category}` : `/collections/${category}` : ''}`
      // Retrieve data from existing page/resource
      const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

      const { content, sha } = resp.data;
      const base64DecodedContent = Base64.decode(content);
      const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
      const {
        title, permalink, file_url: fileUrl, date, third_nav_title: thirdNavTitle,
      } = frontMatter;

      const fileInfo = {
        title,
        permalink,
        fileUrl,
        date,
        mdBody,
        sha,
        category: newCategory,
        prevCategory: category,
        baseApiUrl,
        type: isResource ? 'resource' : 'page',
        thirdNavTitle,
        fileName,
        isNewFile: false,
        siteName,
      }
      await saveFileAndRetrieveUrl(fileInfo)

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

    const errorMessage = validateCategoryName(value)

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

  const toggleDropdownModals = () => {
    setCanShowFileMoveDropdown(!canShowFileMoveDropdown)
    setCanShowDropdown(!canShowDropdown)
  }
  
  return (
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
            <i id={`settingsIcon-${itemIndex}`} className="bx bx-cog" />
          </button>
          {canShowDropdown &&
            <div className={`position-absolute ${elementStyles.dropdown}`} ref={dropdownRef} tabIndex={2} onBlur={()=>setCanShowDropdown(false)}>
              <MenuItem handler={settingsToggle} id={`settings-${itemIndex}`}>Edit details</MenuItem>
              <MenuItem handler={toggleDropdownModals}>
                Move to
              </MenuItem>
          </div>}
          {canShowFileMoveDropdown &&
            <div className={`position-absolute ${elementStyles.dropdown}`} ref={fileMoveDropdownRef} tabIndex={1} onBlur={()=>{console.log(document.activeElement); console.log(categoryInputRef.current); }}>
              <div className={`d-flex text-nowrap ${elementStyles.dropdownItem}`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}}>
                <i className="bx bx-sm bx-arrow-back" onClick={toggleDropdownModals}/>
                Move to
              </div>
              <hr/>
              {category && !isResource &&
                <MenuItem handler={() => {
                    const event = {
                      target: {
                        value: '',
                      },
                    };
                    moveFile(event)
                  }}>
                  Unlinked Page
                </MenuItem>
              }
              {allCategories
                ?
                allCategories.map((categoryName) => {
                  if (categoryName !== category) {
                    return (
                      <MenuItem handler={() => {
                          const event = {
                            target: {
                              value: categoryName,
                            },
                          };
                          moveFile(event)
                        }}>
                        {categoryName}
                      </MenuItem>
                    )
                  }
                  return null
                })
                :
                  `Loading Categories...`
              }
              <hr/>
              <div className={`d-flex text-nowrap ${elementStyles.dropdownItem}`} onClick={(e)=>{e.preventDefault();e.stopPropagation()}} ref={categoryInputRef}>
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
                <button disabled={errorMessage} className={errorMessage ? elementStyles.disabled : elementStyles.blue} onClick={()=>{
                  const event = {
                    target: {
                      value: newCategory,
                    },
                  };
                  moveFile(event)}}>
                  Submit
                </button>
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