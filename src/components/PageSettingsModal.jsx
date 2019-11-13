import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import {
  frontMatterParser, concatFrontMatterMdBody, generatePageFileName,
} from '../utils';

export default class PageSettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: '',
      title: '',
      permalink: '',
      mdBody: '',
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
        this.setState({ title: 'TITLE', permalink: 'PERMALINK' });
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
    this.setState({ [id]: value });
  }

  render() {
    const { title, permalink } = this.state;
    const { settingsToggle, isNewPage } = this.props;
    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>{ isNewPage ? 'Create new page' : 'Update page settings'}</h1>
            <button type="button" onClick={settingsToggle}>
              <i className="bx bx-x" />
            </button>
          </div>
          <div className={elementStyles.modalContent}>
            <p>Title</p>
            <input value={title} id="title" onChange={this.changeHandler} />
            <p>Permalink</p>
            <input value={permalink} id="permalink" onChange={this.changeHandler} />
          </div>
          <div className={elementStyles.modalFooter}>
            <button type="button" className={elementStyles.blue} onClick={this.saveHandler}>Save</button>
            {!isNewPage
              ? <button type="button" className={elementStyles.blue} onClick={this.deleteHandler}>Delete</button>
              : null}
          </div>
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
