import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import * as _ from 'lodash';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import {
  frontMatterParser, concatFrontMatterMdBody, generateCollectionPageFileName,
} from '../utils';

// Constants
const PERMALINK_REGEX = '^(/([a-z]+([-][a-z]+)*/)+)$';
const permalinkRegexTest = RegExp(PERMALINK_REGEX);
const PERMALINK_MIN_LENGTH = 4;
const PERMALINK_MAX_LENGTH = 50;
const TITLE_MIN_LENGTH = 4;
const TITLE_MAX_LENGTH = 100;

export default class CollectionPageSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: '',
      title: '',
      permalink: '',
      mdBody: '',
      errors: {
        title: '',
        permalink: '',
      },
    };
  }

  async componentDidMount() {
    try {
      const {
        siteName, fileName, collectionName,
      } = this.props;

      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, {
        withCredentials: true,
      });
      const { sha, content } = resp.data;

      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
      const { title, permalink, third_nav_title: thirdNavTitle } = frontMatter;
      this.setState({
        sha, title, permalink, mdBody, thirdNavTitle,
      });
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async (event) => {
    event.preventDefault();
    try {
      const { siteName, fileName, collectionName } = this.props;
      const {
        sha, title, permalink, mdBody, thirdNavTitle,
      } = this.state;
      const groupIdentifier = fileName.split('-')[0];

      const frontMatter = thirdNavTitle
        ? { title, permalink, third_nav_title: thirdNavTitle }
        : { title, permalink };

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, mdBody);
      const newFileName = generateCollectionPageFileName(title, groupIdentifier);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);

      if (newFileName === fileName) {
        // Update existing file
        const params = {
          content: base64Content,
          sha,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      } else {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, {
          data: { sha },
          withCredentials: true,
        });

        // Create new page
        const params = {
          pageName: newFileName,
          content: base64Content,
        };
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages`, params, {
          withCredentials: true,
        });
      }

      window.location.reload();
      // Refresh page
    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async () => {
    try {
      const { siteName, fileName, collectionName } = this.props;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    let errorMessage = '';
    switch (id) {
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
          console.log('IN REGEX FAIL', value);
          errorMessage = `The permalink should start and end with slashes and contain 
            lowercase words separated by hyphens only.
            `;
        }
        break;
      }
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
      default:
        break;
    }
    this.setState({
      errors: {
        [id]: errorMessage,
      },
      [id]: value,
    });
  }

  render() {
    const { title, permalink, errors } = this.state;
    const { settingsToggle } = this.props;

    // Page settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>Update page settings</h1>
            <button type="button" onClick={settingsToggle}>
              <i className="bx bx-x" />
            </button>
          </div>
          <form className={elementStyles.modalContent} onSubmit={this.saveHandler}>
            <div className={elementStyles.modalFormFields}>
              <p className={elementStyles.formLabel}>Title</p>
              <input
                value={title}
                id="title"
                required
                autoComplete="off"
                onChange={this.changeHandler}
                className={errors.title ? `${elementStyles.error}` : null}
              />
              <span className={elementStyles.error}>
                {' '}
                {errors.title}
                {' '}
              </span>
              <p
                className={elementStyles.formLabel}
              >
Permalink (e.g. /foo/, /foo-bar/, or /foo/bar/)
              </p>
              <input
                value={permalink}
                id="permalink"
                required
                onChange={this.changeHandler}
                autoComplete="off"
                className={errors.permalink ? `${elementStyles.error}` : null}
              />
              <span className={elementStyles.error}>{errors.permalink}</span>
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="submit" className={`${hasErrors ? elementStyles.disabled : elementStyles.blue}`} disabled={hasErrors} value="submit">Save</button>
              <button type="button" className={elementStyles.warning} onClick={this.deleteHandler}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

CollectionPageSettingsModal.propTypes = {
  settingsToggle: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
};
