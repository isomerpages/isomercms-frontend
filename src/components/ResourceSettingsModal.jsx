import React, { Component } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
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

// Constants
const TITLE_MIN_LENGTH = 4;
const TITLE_MAX_LENGTH = 100;
const DATE_REGEX = '^([0-9]{4}-[0-9]{2}-[0-9]{2})$';
const dateRegexTest = RegExp(DATE_REGEX);
const PERMALINK_REGEX = '^(/([a-z]+([-][a-z]+)*/)+)$';
const permalinkRegexTest = RegExp(PERMALINK_REGEX);
const PERMALINK_MIN_LENGTH = 4;
const PERMALINK_MAX_LENGTH = 50;
const RADIX_PARSE_INT = 10;

const validateDayOfMonth = (month, day) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
    {
      return day > 0 && day < 32;
    }
    case 4:
    case 6:
    case 9:
    case 11:
    {
      return day > 0 && day < 31;
    }
    case 2:
    {
      return day > 0 && day < 29;
    }
    default:
      return false;
  }
};

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
      },
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
          title, permalink, fileUrl, date, sha, mdBody, category, resourceCategories,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  permalinkFileUrlToggle = () => {
    const { permalink } = this.state;
    if (permalink) {
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
        title, permalink, fileUrl, date, mdBody, sha, category,
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

      if (newFileName !== fileName) {
        // We'll need to create a new .md file with a new filename
        params = {
          content: base64EncodedContent,
          pageName: newFileName,
        };

        // If it is an existing post, delete the existing page
        if (!isNewPost) {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
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
    let errorMessage = '';

    switch (id) {
      case 'title': {
        // Title is too short
        if (value.length < TITLE_MIN_LENGTH) {
          errorMessage = `The title should be longer than ${TITLE_MIN_LENGTH} characters.`;
        }
        // Title is too long
        if (value.length > TITLE_MAX_LENGTH) {
          errorMessage = `The title should be shorter than ${TITLE_MAX_LENGTH} characters.`;
        }
        break;
      }
      case 'date': {
        // Date is in wrong format
        if (!dateRegexTest.test(value)) {
          errorMessage = 'The date should be in the format YYYY-MM-DD.';
        } else {
          const dateTokens = value.split('-');
          const month = parseInt(dateTokens[1], RADIX_PARSE_INT);
          const day = parseInt(dateTokens[2], RADIX_PARSE_INT);

          // Day value is invalid for the given month
          if (!validateDayOfMonth(month, day)) {
            errorMessage = 'The day value is invalid for the given month.';
          }

          // Month value is invalid
          if (month < 0 || month > 12) {
            errorMessage = 'The month value should be from 01 to 12.';
          }
        }
        break;
      }
      case 'permalink': {
        // Permalink is too short
        if (value.length < PERMALINK_MIN_LENGTH) {
          errorMessage = `The permalink should be longer than ${PERMALINK_MIN_LENGTH} characters.`;
        }
        // Permalink is too long
        if (value.length > PERMALINK_MAX_LENGTH) {
          errorMessage = `The permalink should be shorter than ${PERMALINK_MAX_LENGTH} characters.`;
        }
        // Permalink fails regex
        if (!permalinkRegexTest.test(value)) {
          errorMessage = `The permalink should start and end with slashes and contain 
            lowercase words separated by hyphens only.
            `;
        }
        break;
      }
      case 'fileUrl': {
        // File URL is too short
        if (value.length < PERMALINK_MIN_LENGTH) {
          errorMessage = `The permalink should be longer than ${PERMALINK_MIN_LENGTH} characters.`;
        }
        // File URL is too long
        if (value.length > PERMALINK_MAX_LENGTH) {
          errorMessage = `The permalink should be shorter than ${PERMALINK_MAX_LENGTH} characters.`;
        }
        // File URL fails regex
        if (!permalinkRegexTest.test(value)) {
          console.log('FAILED');
          errorMessage = `The permalink should start and end with slashes and contain 
            lowercase words separated by hyphens only.
            `;
        }
        // TO-DO
        // Check if file exists
        break;
      }
      default: {
        break;
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
      resourceCategories,
      isNewPost,
      permalink,
      fileUrl,
      errors,
    } = this.state;
    const { settingsToggle } = this.props;

    // Resource settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>Resource Settings</h1>
            <button id="settings-CLOSE" type="button" onClick={settingsToggle}>
              <i id="settingsIcon-CLOSE" className="bx bx-x" />
            </button>
          </div>
          <form className={elementStyles.modalContent} onSubmit={this.saveHandler}>
            <div className={elementStyles.modalFormFields}>

              {/* Title */}
              <p className={elementStyles.formLabel}>Title</p>
              <input
                value={dequoteString(title)}
                id="title"
                autoComplete="off"
                onChange={this.changeHandler}
                className={errors.title ? `${elementStyles.error}` : null}
              />
              <span className={elementStyles.error}>{errors.title}</span>

              {/* Date */}
              <p className={elementStyles.formLabel}>Date (YYYY-MM-DD, e.g. 2019-12-23)</p>
              <input
                value={date}
                id="date"
                autoComplete="off"
                onChange={this.changeHandler}
                className={errors.date ? `${elementStyles.error}` : null}
              />
              <span className={elementStyles.error}>{errors.date}</span>

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
              <button type="button" onClick={this.permalinkFileUrlToggle}>{permalink ? 'Switch to download' : 'Switch to post'}</button>
              {permalink
                ? (
                  <>
                    {/* Permalink */}
                    <p className={elementStyles.formLabel}>Permalink</p>
                    <input
                      value={permalink}
                      id="permalink"
                      autoComplete="off"
                      onChange={this.changeHandler}
                      className={errors.permalink ? `${elementStyles.error}` : null}
                    />
                    <span className={elementStyles.error}>{errors.permalink}</span>
                  </>
                )
                : (
                  <>
                    {/* File URL */}
                    <p className={elementStyles.formLabel}>File URL</p>
                    <input
                      value={fileUrl}
                      id="fileUrl"
                      autoComplete="off"
                      onChange={this.changeHandler}
                      className={errors.fileUrl ? `${elementStyles.error}` : null}
                    />
                    <span className={elementStyles.error}>{errors.fileUrl}</span>
                  </>
                )}
            </div>

            {/* Save or Delete buttons */}
            <div className={elementStyles.modalButtons}>
              <button type="submit" className={`${hasErrors ? elementStyles.disabled : elementStyles.blue}`} disabled={hasErrors} value="submit">Save</button>
              { !isNewPost
                ? <button type="button" className={elementStyles.warning} onClick={this.deleteHandler}>Delete</button>
                : null}
            </div>
          </form>
        </div>
      </div>
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
