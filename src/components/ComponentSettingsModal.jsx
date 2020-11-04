import React, { Component } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import FormField from './FormField';
import FormFieldItem from './FormFieldItem';
import LoadingButton from './LoadingButton';
import {
  frontMatterParser,
  concatFrontMatterMdBody,
  enquoteString,
  dequoteString,
  generateResourceFileName,
  generateCollectionPageFileName,
  generatePageFileName,
  retrieveCollectionAndLinkFromPermalink,
} from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { validatePageSettings, validateResourceSettings } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';

// axios settings
axios.defaults.withCredentials = true

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
      if (type === "resource") {
        const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
        const { resources: allCategories } = resourcesResp.data;
        this.setState({
          category: category ? category : allCategories[0].dirName,
          allCategories: allCategories.map((category) => category.dirName),
        })
      } else if (type === "page") {
        const collectionsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`);
        const { collections: collectionCategories } = collectionsResp.data;
        const allCategories = [''].concat(collectionCategories)
        this.setState({
          category: category ? category : allCategories[0],
          allCategories,
        })
      }

      const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${category ? type === "resource" ? `/resources/${category}` : `/collections/${category}` : ''}`
      if (isNewFile) {
        this.setState({
          title: 'Title',
          permalink: 'permalink',
          mdBody: '',
          baseApiUrl,
          type,
          prevCategory: category,
        });
        if (type === "resource") this.setState({date:new Date().toISOString().split("T")[0]})
      } else {
        const resp = await axios.get(`${baseApiUrl}/pages/${fileName}`);

        const { content, sha } = resp.data;
        const base64DecodedContent = Base64.decode(content);
        const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
        const {
          title, permalink, file_url: fileUrl, date, third_nav_title: thirdNavTitle,
        } = frontMatter;

        let existingLink
        if (permalink) {
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
      
      let newFileName, frontMatter
      if (type === "resource") {
        newFileName = generateResourceFileName(title, date);
        frontMatter = { title: enquoteString(title), date };
      } else if (type === "page") {
        frontMatter = thirdNavTitle
          ? { title, permalink, third_nav_title: thirdNavTitle }
          : { title, permalink };
        if (category) {
          const groupIdentifier = fileName.split('-')[0];
          newFileName = generateCollectionPageFileName(title, groupIdentifier);
        } else {
          newFileName = generatePageFileName(title);
        }
      }

      if (permalink) {
        frontMatter.permalink = `/${category ? `${category}/` : ''}${permalink}`;
      }
      if (fileUrl) {
        frontMatter.file_url = fileUrl;
      }
      let newBaseApiUrl
      if (prevCategory) {
        // baseApiUrl can be used as is because user cannot change categories
        newBaseApiUrl = baseApiUrl
      } else {
        if (category) {
          // User is adding file to category from main page
          newBaseApiUrl = `${baseApiUrl}/${type === "resource" ? `resources/${category}` : `collections/${category}`}`
        } else {
          // User is adding file with no collections, only occurs for pages
          newBaseApiUrl = baseApiUrl
        }
      }

      const content = concatFrontMatterMdBody(frontMatter, mdBody);
      const base64EncodedContent = Base64.encode(content);

      let params = {};
      if (newFileName !== fileName || prevCategory !== category) {
        // We'll need to create a new .md file with a new filename
        params = {
          content: base64EncodedContent,
          pageName: newFileName,
        };

        // If it is an existing file, delete the existing page
        if (!isNewFile) {
          await axios.delete(`${newBaseApiUrl}/pages/${fileName}`, {
            data: {
              sha,
            },
          });
        }
        await axios.post(`${newBaseApiUrl}/pages`, params);
      } else {
        // Save to existing .md file
        params = {
          content: base64EncodedContent,
          sha,
        };
        await axios.post(`${newBaseApiUrl}/pages/${fileName}`, params);
      }
      // Refresh page
      !isNewFile && window.location.reload();
      
      let newPageUrl
      if (type === 'resource') {
        newPageUrl = `/sites/${siteName}/resources/${category}/${newFileName}`
      } else if (type === 'page') {
        newPageUrl = category ? `/sites/${siteName}/collections/${category}/${newFileName}` : `/sites/${siteName}/pages/${newFileName}`
      }
      this.setState({ redirectToNewPage: true, newPageUrl })
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    const { pageFilenames, type } = this.props;
    const pageFilenamesExc = pageFilenames ? pageFilenames.filter((filename) => filename !== this.state.fileName) : null
    let errorMessage
    if (type === 'resource') {
      errorMessage = validateResourceSettings(id, value);
    } else if (type === 'page') {
      errorMessage = validatePageSettings(id, value);
      const newFileName = generatePageFileName(value);
      if (errorMessage === '' && pageFilenamesExc && pageFilenamesExc.includes(newFileName)) {
        errorMessage = 'This title is already in use. Please choose a different one.';
      }
    }

    this.setState({
      errors: {
        [id]: errorMessage,
      },
      [id]: value,
    });
  }

  render() {
    const {
      category,
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
                <div className="d-flex">
                  <select className="w-100" id="category" value={category} onChange={this.changeHandler} disabled={!isNewFile}>
                    {
                    allCategories
                      ? allCategories.map((category) => (
                        <option
                          value={category}
                          label={category}
                        />
                      ))
                      : null
                  }
                  </select>
                </div>
                {/* Title */}
                <FormField
                  title="Title"
                  id="title"
                  value={title}
                  errorMessage={errors.title}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Third Nav */}
                { 
                  thirdNavTitle &&
                  <FormField
                    title="3rd Nav Title"
                    id="third-nav"
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
                  isRequired
                  onFieldChange={this.changeHandler}
                  disabled={!isPost}
                  fixedMessage={category ? `/${category}/` : '/'}
                  placeholder=' '
                />
                { type === "resource" && 
                // Resource Type
                <>
                  <div className="d-flex row m-0">
                    <div className="col-4 m-0 p-0">
                      {/* Date */}
                      <FormField
                        title="Date (YYYY-MM-DD)"
                        id="date"
                        value={date}
                        errorMessage={errors.date}
                        isRequired
                        onFieldChange={this.changeHandler}
                      />
                    </div>
                    
                    <div className="col-8">
                      <p className={elementStyles.formLabel}>Resource Type</p>
                      {/* Permalink or File URL */}
                      <div className="d-flex">
                        <label htmlFor="radio-post" className="flex-fill">
                          <input
                            type="radio"
                            id="radio-post"
                            name="resource-type"
                            value="post"
                            onClick={this.handlePermalinkFileUrlToggle}
                            checked={isPost}
                          />
                          Post Content
                        </label>
                        <label htmlFor="radio-post" className="flex-fill">
                          <input
                            type="radio"
                            id="radio-file"
                            name="resource-type"
                            value="file"
                            onClick={this.handlePermalinkFileUrlToggle}
                            checked={!isPost}
                          />
                          Downloadable File
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* File URL */}
                  <FormFieldItem
                    title="Select File"
                    id="fileUrl"
                    value={fileUrl?.split('/').pop()}
                    errorMessage={errors.fileUrl}
                    onFieldChange={this.changeHandler}
                    inlineButtonText={"Select File"}
                    siteName={siteName}
                    placeholder=" "
                    type="file"
                  />
                </>}
              </div>
              {/* Save or Delete buttons */}
              <div className={elementStyles.modalButtons}>
                <LoadingButton
                  label="Save"
                  disabled={hasErrors}
                  disabledStyle={elementStyles.disabled}
                  className={`ml-auto ${(isNewFile ? hasErrors : (hasErrors || !sha)) ? elementStyles.disabled : elementStyles.blue}`}
                  callback={this.saveHandler}
                />
                { !isNewFile
                  ? (
                    <LoadingButton
                      label="Delete"
                      disabled={(hasErrors)}
                      disabledStyle={elementStyles.disabled}
                      className={`${hasErrors ? elementStyles.disabled : elementStyles.warning}`}
                      callback={() => this.setState({ canShowDeleteWarningModal: true })}
                    />
                  ) : null}
              </div>
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
  category: PropTypes.string.isRequired,
  isNewFile: PropTypes.bool.isRequired,
  settingsToggle: PropTypes.func.isRequired,
};