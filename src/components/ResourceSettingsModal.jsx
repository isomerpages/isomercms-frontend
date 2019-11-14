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
        category: ''
      }
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
          title: 'TITLE',
          permalink: 'PERMALINK',
          date: 'DATE',
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
      this.setState({ permalink: null, fileUrl: 'FILE_URL' });
    } else {
      this.setState({ permalink: 'PERMALINK', fileUrl: null });
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
    this.setState({ [id]: value });
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
      errors
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
              <input value={dequoteString(title)} id="title" onChange={this.changeHandler} />
              {/* Date */}
              <p className={elementStyles.formLabel}>Date (YYYY-MM-DD, e.g. 2019-12-23)</p>
              <input value={date} id="date" onChange={this.changeHandler} />
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
                    <p className={elementStyles.formLabel}>Permalink</p>
                    <input value={permalink} id="permalink" onChange={this.changeHandler} />
                  </>
                )
                : (
                  <>
                    <p className={elementStyles.formLabel}>File URL</p>
                    <input value={fileUrl} id="fileUrl" onChange={this.changeHandler} />
                  </>
                )}
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="submit" className={`${hasErrors ? elementStyles.disabled : elementStyles.blue}`} disabled={hasErrors} value="submit">Save</button>
              { !isNewPost
                ? <button type="button" className={elementStyles.blue} onClick={this.deleteHandler}>Delete</button>
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
