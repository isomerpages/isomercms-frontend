import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import * as _ from 'lodash';
import Bluebird from 'bluebird';
import update from 'immutability-helper';
import FormField from './FormField';
import FormFieldPermalink from './FormFieldPermalink';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import {
  frontMatterParser,
  concatFrontMatterMdBody,
  generatePageFileName,
  generatePermalink,
} from '../utils';
import LoadingButton from './LoadingButton';
import { validatePageSettings } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';

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
      canShowDeleteWarningModal: false,
      baseUrl: '',
      pagePermalinks: [],
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
          permalink: '/title/',
          baseUrl,
          pagePermalinks,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async () => {
    try {
      const {
        siteName, fileName, isNewPage,
      } = this.props;
      const {
        sha, title, permalink, mdBody, errors,
      } = this.state;

      // Run error checks across all form fields if creating new page
      if (isNewPage) {
        const formFields = [
          {
            target: {
              id: 'permalink',
              value: permalink,
            },
          },
          {
            target: {
              id: 'title',
              value: title,
            },
          },
        ];
        formFields.forEach((formField) => this.changeHandler(formField));

        // If there are any errors, prevent form submission
        const hasErrors = _.some(errors, (field) => field.length > 0);
        if (hasErrors) return;
      }

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
    const { pageFilenames, isNewPage } = this.props;
    let errorMessage = '';

    // If the permalink changed, append '/' before and after the permalink
    if (id === 'permalink') {
      const permalinkValue = `/${value}/`;
      value = permalinkValue;
      errorMessage = validatePageSettings(id, value);

      // Check if permalink is already in use
      if (errorMessage === '' && pagePermalinks.includes(value)) {
        errorMessage = 'This URL is already in use. Please choose a different one.';
      }
    } else { // id === 'title'
      errorMessage = validatePageSettings(id, value);

      const newFileName = generatePageFileName(value);
      if (errorMessage === '' && pageFilenames.includes(newFileName)) {
        errorMessage = 'This title is already in use. Please choose a different one.';
      }

      if (isNewPage) {
        this.changeHandler({
          target: {
            id: 'permalink',
            value: generatePermalink(value),
          },
        });
      }
    }

    this.setState((currState) => ({
      errors: update(currState.errors, {
        [id]: {
          $set: errorMessage,
        },
      }),
      [id]: value,
    }));
  }

  render() {
    const {
      title,
      permalink,
      errors,
      baseUrl,
      sha,
      canShowDeleteWarningModal,
    } = this.state;
    const { settingsToggle, isNewPage } = this.props;

    // Delete the '/' at the start and end of the permalink string
    const processedPermalink = permalink.slice(1, -1);

    // Page settings form has errors - disable save button
    const hasErrors = _.some(errors, (field) => field.length > 0);

    return (
      <>
        <div className={elementStyles.overlay}>
          <div className={elementStyles.modal}>
            <div className={elementStyles.modalHeader}>
              <h1>{ isNewPage ? 'Create new page' : 'Update page settings'}</h1>
              <button type="button" onClick={settingsToggle}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
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
                />
              </div>
              <div className={elementStyles.modalButtons}>
                {!isNewPage
                  ? (
                    <>
                      <LoadingButton
                        label="Save"
                        disabled={(hasErrors || !sha)}
                        disabledStyle={elementStyles.disabled}
                        className={(hasErrors || !sha) ? elementStyles.disabled : elementStyles.blue}
                        callback={this.saveHandler}
                      />
                      <LoadingButton
                        label="Delete"
                        disabled={(hasErrors || !sha)}
                        disabledStyle={elementStyles.disabled}
                        className={(hasErrors || !sha) ? elementStyles.disabled : elementStyles.warning}
                        callback={() => this.setState({ canShowDeleteWarningModal: true })}
                      />
                    </>
                  ) : (
                    <LoadingButton
                      label="Save"
                      disabled={hasErrors}
                      disabledStyle={elementStyles.disabled}
                      className={(hasErrors) ? elementStyles.disabled : elementStyles.blue}
                      callback={this.saveHandler}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
        {
            canShowDeleteWarningModal
            && (
            <DeleteWarningModal
              onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
              onDelete={this.deleteHandler}
              type="page"
            />
            )
        }
      </>
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
