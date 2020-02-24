import React, { Component } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import FormField from './FormField';
import FormFieldFile from './FormFieldFile';
import LoadingButton from './LoadingButton';
import {
  prettifyResourceCategory,
  slugifyResourceCategory,
  frontMatterParser,
  concatFrontMatterMdBody,
  enquoteString,
  dequoteString,
  generateResourceFileName,
} from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { validateResourceSettings } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';

export default class ResourceSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      permalink: '',
      fileUrl: '',
      date: '',
      mdBody: null,
      category: '',
      sha: '',
      resourceCategories: null,
      errors: {
        title: '',
        permalink: '',
        fileUrl: '',
        date: '',
        category: '',
        prevCategory: '',
      },
      canShowDeleteWarningModal: false,
    };
  }

  async componentDidMount() {
    try {
      const {
        category, siteName, fileName, isNewPost,
      } = this.props;
      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources: resourceCategories } = resourcesResp.data;

      if (isNewPost) {
        this.setState({
          title: 'Title',
          permalink: '/permalink/',
          date: '2019-01-31',
          mdBody: '',
          category: resourceCategories[0].dirName,
          resourceCategories,
        });
      } else {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
          withCredentials: true,
        });

        const { content, sha } = resp.data;
        const base64DecodedContent = Base64.decode(content);
        const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
        const {
          title, permalink, file_url: fileUrl, date,
        } = frontMatter;

        this.setState({
          title,
          permalink,
          fileUrl,
          date,
          sha,
          mdBody,
          prevCategory: category,
          category,
          resourceCategories,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handlePermalinkFileUrlToggle = (event) => {
    const { target: { value } } = event;
    if (value === 'file') {
      this.setState({ permalink: null, fileUrl: '/file/url/' });
    } else {
      this.setState({ permalink: '/permalink/', fileUrl: null });
    }
  }

  deleteHandler = async () => {
    try {
      const { sha } = this.state;
      const { category, fileName, siteName } = this.props;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
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
        title, permalink, fileUrl, date, mdBody, sha, category, prevCategory,
      } = this.state;
      const { fileName, siteName, isNewPost } = this.props;

      const frontMatter = { title: enquoteString(title), date };
      let type = '';
      if (permalink) {
        frontMatter.permalink = permalink;
        type = 'post';
      }
      if (fileUrl) {
        frontMatter.file_url = fileUrl;
        type = 'download';
      }

      const content = concatFrontMatterMdBody(frontMatter, mdBody);
      const base64EncodedContent = Base64.encode(content);

      const newFileName = generateResourceFileName(dequoteString(title), type, date);
      let params = {};

      if (newFileName !== fileName || prevCategory !== category) {
        // We'll need to create a new .md file with a new filename
        params = {
          content: base64EncodedContent,
          pageName: newFileName,
        };

        // If it is an existing post, delete the existing page
        if (!isNewPost) {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${prevCategory}/pages/${fileName}`, {
            data: {
              sha,
            },
            withCredentials: true,
          });
        }

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages`, params, {
          withCredentials: true,
        });
      } else {
        // Save to existing .md file
        params = {
          content: base64EncodedContent,
          sha,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      }

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    const errorMessage = validateResourceSettings(id, value);

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
      resourceCategories,
      permalink,
      fileUrl,
      errors,
      canShowDeleteWarningModal,
      sha,
    } = this.state;
    const { settingsToggle, isNewPost } = this.props;

    // Resource settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <>
        <div className={elementStyles.overlay}>
          <div className={elementStyles.modal}>
            <div className={elementStyles.modalHeader}>
              <h1>Resource Settings</h1>
              <button id="settings-CLOSE" type="button" onClick={settingsToggle}>
                <i id="settingsIcon-CLOSE" className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
              <div className={elementStyles.modalFormFields}>
                {/* Title */}
                <FormField
                  title="Title"
                  id="title"
                  value={dequoteString(title)}
                  errorMessage={errors.title}
                  isRequired
                  onFieldChange={this.changeHandler}
                />

                {/* Date */}
                <FormField
                  title="Date (YYYY-MM-DD, e.g. 2019-12-23)"
                  id="date"
                  value={date}
                  errorMessage={errors.date}
                  isRequired
                  onFieldChange={this.changeHandler}
                />

                {/* Resource Category */}
                <p className={elementStyles.formLabel}>Resource Category</p>
                <select id="category" value={slugifyResourceCategory(category)} onChange={this.changeHandler}>
                  {
                  resourceCategories
                    ? resourceCategories.map((resourceCategory) => (
                      <option
                        value={slugifyResourceCategory(resourceCategory.dirName)}
                        label={prettifyResourceCategory(resourceCategory.dirName)}
                      />
                    ))
                    : null
                }
                </select>

                {/* Resource Type */}
                <p className={elementStyles.formLabel}>Resource Type</p>

                {/* Permalink or File URL */}
                <div className="d-flex">
                  <label htmlFor="radio-post" className="flex-fill">
                    <input type="radio" id="radio-post" name="resource-type" value="post" onClick={this.handlePermalinkFileUrlToggle} checked={!!permalink} />
                    Post Content
                  </label>
                  <label htmlFor="radio-post" className="flex-fill">
                    <input type="radio" id="radio-file" name="resource-type" value="file" onClick={this.handlePermalinkFileUrlToggle} checked={!permalink} />
                    Downloadable File
                  </label>
                </div>
                {permalink
                  ? (
                    <>
                      {/* Permalink */}
                      <FormField
                        title="Permalink"
                        id="permalink"
                        value={permalink}
                        errorMessage={errors.permalink}
                        isRequired
                        onFieldChange={this.changeHandler}
                      />
                    </>
                  )
                  : (
                    <>
                      {/* File URL */}
                      <FormFieldFile
                        title="Select File"
                        id="fileUrl"
                        value={fileUrl.split('/').pop()}
                        errorMessage={errors.fileUrl}
                        isRequired
                        onFieldChange={this.changeHandler}
                        inlineButtonText="Select File"
                      />
                    </>
                  )}
              </div>
            </div>
            {/* Save or Delete buttons */}
            <div className={elementStyles.modalButtons}>
              <LoadingButton
                label="Save"
                disabled={hasErrors}
                disabledStyle={elementStyles.disabled}
                className={(isNewPost ? hasErrors : (hasErrors || !sha)) ? elementStyles.disabled : elementStyles.blue}
                callback={this.saveHandler}
              />
              { !isNewPost
                ? (
                  <button type="button" className={elementStyles.warning} onClick={() => this.setState({ canShowDeleteWarningModal: true })}>Delete</button>
                ) : null}
            </div>
          </div>
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
      </>
    );
  }
}

ResourceSettingsModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  isNewPost: PropTypes.bool.isRequired,
  settingsToggle: PropTypes.func.isRequired,
};
