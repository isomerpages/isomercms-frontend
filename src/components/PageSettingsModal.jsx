import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import * as _ from 'lodash';
import FormField from './FormField'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import {
  frontMatterParser, concatFrontMatterMdBody, generatePageFileName,
} from '../utils';

// Constants
const PERMALINK_REGEX = '^(/([a-z]+([-][a-z]+)*/)+)$';
const permalinkRegexTest = RegExp(PERMALINK_REGEX);
const PERMALINK_MIN_LENGTH = 4;
const PERMALINK_MAX_LENGTH = 50;
const TITLE_MIN_LENGTH = 4;
const TITLE_MAX_LENGTH = 100;

export default class PageSettingsModal extends Component {
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
      const { siteName, fileName, isNewPage } = this.props;

      if (!isNewPage) {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
          withCredentials: true,
        });
        const { sha, content } = resp.data;

        // split the markdown into front matter and content
        const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
        const { title, permalink } = frontMatter;
        this.setState({
          sha, title, permalink, mdBody,
        });
      } else {
        this.setState({ title: 'Title', permalink: '/permalink/' });
      }
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async () => {
    try {
      const { siteName, fileName, isNewPage } = this.props;
      const {
        sha, title, permalink, mdBody,
      } = this.state;

      const frontMatter = { title, permalink };

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, mdBody);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const newFileName = generatePageFileName(title);

      if (isNewPage) {
        // Create new page
        const params = {
          pageName: newFileName,
          content: base64Content,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, params, {
          withCredentials: true,
        });
      } else if (newFileName === fileName) {
        // A new file does not need to be created; the title has not changed
        const params = {
          content: base64Content,
          sha,
        };

        // Update existing file
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      } else {
        // A new file needs to be created
        // Delete existing page
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
          data: { sha },
          withCredentials: true,
        });

        // Create new page
        const params = {
          pageName: newFileName,
          content: base64Content,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, params, {
          withCredentials: true,
        });
      }

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async () => {
    try {
      const { siteName, fileName } = this.props;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
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
    const { settingsToggle, isNewPage } = this.props;

    // Page settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>{ isNewPage ? 'Create new page' : 'Update page settings'}</h1>
            <button type="button" onClick={settingsToggle}>
              <i className="bx bx-x" />
            </button>
          </div>
          <form className={elementStyles.modalContent} onSubmit={this.saveHandler}>
            <div className={elementStyles.modalFormFields}>
              <FormField 
                title={`Title`}
                id={`title`}
                value={title}
                hasError
                errorMessage={errors.title}
                isRequired={true}
                onFieldChange={this.changeHandler}
              />
              <FormField 
                title={`Permalink (e.g. /foo/, /foo-bar/, or /foo/bar/)`}
                id="permalink"
                value={permalink}
                hasError
                errorMessage={errors.permalink}
                isRequired={true}
                onFieldChange={this.changeHandler}
              />
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="submit" className={`${hasErrors ? elementStyles.disabled : elementStyles.blue}`} disabled={hasErrors} value="submit">Save</button>
              {!isNewPage
                ? <button type="button" className={elementStyles.warning} onClick={this.deleteHandler}>Delete</button>
                : null}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

PageSettingsModal.propTypes = {
  settingsToggle: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isNewPage: PropTypes.func.isRequired,
};
