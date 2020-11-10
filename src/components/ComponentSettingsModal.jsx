import React, { Component } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable'
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import FormField from './FormField';
import {
  frontMatterParser,
  dequoteString,
  generatePageFileName,
  generateResourceFileName,
  retrieveCollectionAndLinkFromPermalink,
  saveFileAndRetrieveUrl,
} from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { validatePageSettings, validateResourceSettings } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';

// axios settings
axios.defaults.withCredentials = true

const isCategoryDropdownDisabled = (isNewFile, category) => {
  if (category) {
    return true
  }
  if (isNewFile) return false
  return true
}

export default class ComponentSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      permalink: '',
      fileUrl: null,
      date: '',
      mdBody: null,
      category: '',
      sha: '',
      allCategories: null,
      type: '',
      errors: {
        title: '',
        permalink: '',
        fileUrl: '',
        date: '',
        category: '',
        prevCategory: '',
      },
      canShowDeleteWarningModal: false,
      baseApiUrl: '',
      prevCategory: '',
      thirdNavTitle: '',
      redirectToNewPage: false,
      newPageUrl: '',
      isPost: true,
      originalPermalink: '',
      originalFileUrl: '',
    };
  }

  async componentDidMount() {
    try {
      const {
        category, siteName, fileName, isNewFile, type
      } = this.props;
      
      // Retrieve the list of all page/resource categories for use in the dropdown options. Also sets the default category if none is specified.
      if (type === "resource") {
        const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
        const { resources: allCategories } = resourcesResp.data;
        this.setState({
          category: category ? category : '',
          allCategories: allCategories.map((category) => category.dirName),
        })
      } else if (type === "page") {
        const collectionsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`);
        const { collections: collectionCategories } = collectionsResp.data;
        const allCategories = [''].concat(collectionCategories)
        this.setState({
          category: category ? category : '',
          allCategories,
        })
      }

      const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? type === "resource" ? `/resources/${category}` : `/collections/${category}` : ''}`
      if (isNewFile) {
        // Set default values for a new file
        this.setState({
          title: 'Title',
          permalink: 'permalink',
          mdBody: '',
          baseApiUrl,
          type,
          prevCategory: category,
        });
        // Only resources have a date field
        if (type === "resource") this.setState({date:new Date().toISOString().split("T")[0]})
      } else {
        // Retrieve data from existing page/resource
        const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

        const { content, sha } = resp.data;
        const base64DecodedContent = Base64.decode(content);
        const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
        const {
          title, permalink, file_url: fileUrl, date, third_nav_title: thirdNavTitle,
        } = frontMatter;

        let existingLink
        if (permalink) {
          // We want to set parts of the link by default, and only leave a portion editable by the user
          const { editableLink } = retrieveCollectionAndLinkFromPermalink(permalink)
          existingLink = editableLink
        }

        this.setState({
          title: dequoteString(title),
          permalink: existingLink,
          originalPermalink: existingLink,
          fileUrl,
          originalFileUrl: fileUrl,
          date,
          sha,
          mdBody,
          prevCategory: category,
          baseApiUrl,
          type,
          thirdNavTitle,
          isPost: !fileUrl
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handlePermalinkFileUrlToggle = (event) => {
    const { target: { value } } = event;
    const { originalFileUrl, originalPermalink} = this.state
    if (value === 'file') {
      this.setState({
        permalink: null,
        fileUrl: originalFileUrl ? originalFileUrl : '',
        isPost: false,
      });
    } else {
      this.setState({
        permalink: originalPermalink ? originalPermalink : 'permalink',
        fileUrl: null,
        isPost: true,
        errors: {
          fileUrl: '',
        },
      });
    }
  }

  deleteHandler = async () => {
    try {
      const { sha, baseApiUrl } = this.state;
      const { fileName } = this.props;
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

  saveHandler = async () => {
    try {
      const {
        title, permalink, fileUrl, date, mdBody, sha, category, prevCategory, baseApiUrl, type, thirdNavTitle,
      } = this.state;
      const { fileName, isNewFile, siteName } = this.props;

      const fileInfo = {
        title,
        permalink,
        fileUrl,
        date,
        mdBody,
        sha,
        category,
        prevCategory,
        baseApiUrl,
        type,
        thirdNavTitle,
        fileName,
        isNewFile,
        siteName,
      }
      
      const newPageUrl = await saveFileAndRetrieveUrl(fileInfo)
      // Refresh page
      !isNewFile && window.location.reload();
      this.setState({ redirectToNewPage: true, newPageUrl })
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    const { title, date } = this.state
    const { pageFilenames, type, fileName: currentFileName } = this.props;

    const pageFilenamesExc = pageFilenames ? pageFilenames.filter((filename) => filename !== currentFileName) : null
    let errorMessage, newFileName
    if (type === 'resource') {
      errorMessage = validateResourceSettings(id, value);
      newFileName = generateResourceFileName(id==="title" ? value : title, id==="date" ? value : date)
    } else if (type === 'page') {
      errorMessage = validatePageSettings(id, value);
      newFileName = generatePageFileName(value);
    }

    if (errorMessage === '' && pageFilenamesExc && pageFilenamesExc.includes(newFileName)) {
      this.setState({
        errors: {
          title: 'This title is already in use. Please choose a different one.',
        },
        [id]: value,
      })
    } else {
      this.setState({
        errors: {
          [id]: errorMessage,
        },
        [id]: value,
      });
    }
  }

  selectChangeHandler = (newValue) => {
    let event
    if (!newValue) {
      // Field was cleared
      event = {
        target: {
          id: 'category',
          value: ''
        }
      }
    } else {
      const { value } = newValue
      event = {
        target: {
          id: 'category',
          value: value
        }
      }
    }
    
    this.changeHandler(event)
  };


  render() {
    const {
      category,
      prevCategory,
      title,
      date,
      allCategories,
      permalink,
      fileUrl,
      errors,
      canShowDeleteWarningModal,
      sha,
      redirectToNewPage,
      newPageUrl,
      thirdNavTitle,
      isPost,
    } = this.state;
    const { settingsToggle, isNewFile, type, modalTitle, siteName } = this.props;

    // Settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <>
        <div className={elementStyles.overlay}>
          { (sha || isNewFile)
          && (
          <div className={elementStyles['modal-settings']}>
            <div className={elementStyles.modalHeader}>
              <h1>{modalTitle}</h1>
              <button id="settings-CLOSE" type="button" onClick={settingsToggle}>
                <i id="settingsIcon-CLOSE" className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
              <div className={elementStyles.modalFormFields}>
                {/* Category */}
                <p className={elementStyles.formLabel}>Category Folder Name</p>
                <div className="d-flex text-nowrap">
                  <CreatableSelect
                    isClearable
                    className="w-100"
                    onChange={this.selectChangeHandler}
                    isDisabled={isCategoryDropdownDisabled(isNewFile, prevCategory)}
                    defaultValue={{value:category,label:category ? category : "Select a category or create a new category..."}}
                    options={
                      allCategories
                      ? allCategories.map((category) => (
                        {
                          value:category,
                          label:category ? category : 'Unlinked Page'
                        }
                      ))
                      : null
                    }
                  />
                </div>
                <span className={elementStyles.error}>{errors.category}</span>
                {/* Title */}
                <FormField
                  title="Title"
                  id="title"
                  value={title}
                  errorMessage={errors.title}
                  isRequired={true}
                  onFieldChange={this.changeHandler}
                />
                {/* Third Nav */}
                { 
                  thirdNavTitle &&
                  <FormField
                    title="3rd Nav Title"
                    id="thirdNavTitle"
                    value={thirdNavTitle}
                    onFieldChange={this.changeHandler}
                  />
                }
                {/* Permalink */}
                <FormField
                  title="Permalink"
                  id="permalink"
                  value={permalink ? permalink : ''}
                  errorMessage={errors.permalink}
                  isRequired={true}
                  onFieldChange={this.changeHandler}
                  disabled={!isPost}
                  fixedMessage={category ? `/${category}/${thirdNavTitle ? `${thirdNavTitle}/` : ''}` : '/'}
                  placeholder=' '
                />
                { type === "resource" && 
                <ResourceFormFields 
                  date={date}
                  errors={errors}
                  changeHandler={this.changeHandler}
                  onToggle={this.handlePermalinkFileUrlToggle}
                  isPost={isPost}
                  siteName={siteName}
                  fileUrl={fileUrl ? fileUrl : ''}
                />
                }
              </div>
              <SaveDeleteButtons 
                isDisabled={isNewFile ? hasErrors || (type==='resource' && category==='') : (hasErrors || !sha)}
                hasDeleteButton={!isNewFile}
                saveCallback={this.saveHandler}
                deleteCallback={() => this.setState({ canShowDeleteWarningModal: true })}
              />
            </div>
          </div>
          )}
        </div>
        {
          canShowDeleteWarningModal
          && (
            <DeleteWarningModal
              onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
              onDelete={this.deleteHandler}
              type="resource"
            />
          )
        }
        {
          isNewFile
          && redirectToNewPage
          && (
            <Redirect
              to={{
                pathname: newPageUrl
              }}
            />
          )
        }
      </>
    );
  }
}

ComponentSettingsModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  category: PropTypes.string,
  isNewFile: PropTypes.bool.isRequired,
  settingsToggle: PropTypes.func.isRequired,
};