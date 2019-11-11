import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import LeftNavPage from '../templates/LeftNavPage';
import {
  frontMatterParser, concatFrontMatterMdBody, prependImageSrc, changeFileName,
} from '../utils';
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';
import styles from '../styles/App.module.scss';

export default class EditCollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      sha: null,
      editorValue: '',
      frontMatter: '',
      tempFileName: '',
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
      this.setState({
        content,
        sha,
        editorValue: mdBody.trim(),
        frontMatter,
      });
    } catch (err) {
      console.log(err);
    }
  }

  createPage = async () => {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const { editorValue, frontMatter } = this.state;

      // here, we need to add the appropriate front matter before we encode
      // this part needs to be revised to include permalink and other things depending on page type
      const upload = concatFrontMatterMdBody(frontMatter, editorValue);

      const base64Content = Base64.encode(upload);
      const params = {
        pageName: fileName,
        content: base64Content,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages`, params, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      this.setState({ content, sha });
    } catch (err) {
      console.log(err);
    }
  }

  updatePage = async () => {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const { editorValue, frontMatter, sha } = this.state;

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, editorValue);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const params = {
        content: base64Content,
        sha,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, params, {
        withCredentials: true,
      });
      const { content, newSha } = resp.data;
      this.setState({ content, sha: newSha });
    } catch (err) {
      console.log(err);
    }
  }

  deletePage = async () => {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  renamePage = async () => {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const { content, sha, tempFileName } = this.state;
      const newFileName = tempFileName;
      const params = { content, sha };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  onEditorChange = (value) => {
    this.setState({ editorValue: value });
  }

  render() {
    const { match, location } = this.props;
    const { siteName, collectionName, fileName } = match.params;
    const { leftNavPages } = location.state;
    const { sha, editorValue } = this.state;
    return (
      <>
        <h3>
          Editing page
          {' '}
          {fileName}
        </h3>
        <div className="d-flex">
          <div className={`${styles.leftPane} p-3`}>
            <SimpleMDE
              onChange={this.onEditorChange}
              value={editorValue}
              options={{
                hideIcons: ['preview', 'side-by-side', 'fullscreen'],
                showIcons: ['code', 'table'],
              }}
            />
            <button type="button" onClick={sha ? this.updatePage : this.createPage}>Save</button>
            <br />
            <br />
            <button type="button" onClick={this.deletePage}>Delete</button>
            <br />
            <br />
            <input placeholder="New file name" onChange={(event) => changeFileName(event, this)} />
            <button type="button" onClick={this.renamePage}>Rename</button>
          </div>
          <div className={styles.rightPane}>
            <LeftNavPage
              chunk={prependImageSrc(siteName, marked(editorValue))}
              leftNavPages={leftNavPages}
              fileName={fileName}
            />
          </div>
        </div>

      </>
    );
  }
}

EditCollectionPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      collectionName: PropTypes.string,
      fileName: PropTypes.string,
      newFileName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      leftNavPages: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string,
        fileName: PropTypes.string,
      })),
    }),
  }).isRequired,
};
