import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import * as _ from 'lodash';
import Bluebird from 'bluebird';
import FormField from './FormField';
import FormFieldPermalink from './FormFieldPermalink';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import {
  frontMatterParser, concatFrontMatterMdBody, generatePageFileName,
} from '../utils';
import { validatePageSettings } from '../utils/validators';

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
      permalinkSetterIsActive: false,
      baseUrl: '',
    };
  }

  async componentDidMount() {
    try {
      const {
        siteName, fileName, isNewPage, pageFilenames,
      } = this.props;

      // get settings data from backend
      const settingsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`, {
        withCredentials: true,
      });
      const { settings } = settingsResp.data;
      const { configFieldsRequired } = settings;
      const baseUrl = configFieldsRequired.url;
      this.setState({ baseUrl });

      // Get the list of permalinks of other Pages (simple-pages)
      const pagePermalinks = await Bluebird.map(pageFilenames, async (pageFileName) => {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${pageFileName}`, {
          withCredentials: true,
        });
        const { content } = resp.data;
        const { frontMatter } = frontMatterParser(Base64.decode(content));
        const { permalink } = frontMatter;

        return permalink;
      });

      if (!isNewPage) {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
          withCredentials: true,
        });
        const { sha, content } = resp.data;

        // split the markdown into front matter and content
        const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
        const { title, permalink } = frontMatter;
        this.setState({
          sha,
          title,
          permalink,
          mdBody,
          baseUrl,
          pagePermalinks,
        });
      } else {
        this.setState({
          title: 'Title',
          permalink: '/permalink/',
          baseUrl,
          pagePermalinks,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async (event) => {
    event.preventDefault();
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

      if (newFileName === fileName && !isNewPage) {
        // Update existing file
        const params = {
          content: base64Content,
          sha,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      } else {
        // A new file needs to be created
        if (newFileName !== fileName && !isNewPage) {
          // Delete existing page
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
            data: { sha },
            withCredentials: true,
          });
        }

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
    const { id } = event.target;
    let { value } = event.target;
    const { pagePermalinks } = this.state;
    let errorMessage = '';

    // If the permalink changed, append '/' before and after the permalink
    if (id === 'permalink') {
      const permalinkValue = `/${value}/`;
      value = permalinkValue;
      errorMessage = validatePageSettings(id, permalinkValue);

      // Check if permalink is already in use
      if (errorMessage === '' && pagePermalinks.includes(permalinkValue)) {
        errorMessage = 'This URL is already in use. Please choose a different one.';
      }
    } else {
      errorMessage = validatePageSettings(id, value);
    }

    this.setState({
      errors: {
        [id]: errorMessage,
      },
      [id]: value,
    });
  }

  togglePermalinkSetter = () => {
    this.setState((currState) => ({
      permalinkSetterIsActive: !currState.permalinkSetterIsActive,
    }));
  }

  render() {
    const {
      title,
      permalink,
      errors,
      permalinkSetterIsActive,
      baseUrl,
    } = this.state;
    const { settingsToggle, isNewPage } = this.props;

    // Delete the '/' at the start and end of the permalink string
    const processedPermalink = permalink.slice(1, -1);

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
                title="Title"
                id="title"
                value={title}
                errorMessage={errors.title}
                isRequired
                onFieldChange={this.changeHandler}
              />
              <FormFieldPermalink
                title="URL"
                id="permalink"
                urlPrefix={`${baseUrl}/`}
                value={processedPermalink}
                errorMessage={errors.permalink}
                isRequired
                onFieldChange={this.changeHandler}
                isActive={permalinkSetterIsActive}
                togglePermalinkSetter={this.togglePermalinkSetter}
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
  isNewPage: PropTypes.bool.isRequired,
  pageFilenames: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
};
