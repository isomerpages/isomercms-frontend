import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import _ from 'lodash';
import LeftNavPage from '../templates/LeftNavPage';
import {
  frontMatterParser, concatFrontMatterMdBody, prependImageSrc, prettifyPageFileName,
} from '../utils';
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';

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

      const collectionPagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}`, {
        withCredentials: true,
      });
      const { collectionPages: leftNavPages } = collectionPagesResp.data;

      this.setState({
        content,
        sha,
        editorValue: mdBody.trim(),
        frontMatter,
        leftNavPages,
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
    const { leftNavPages } = this.state;
    const { sha, editorValue } = this.state;
    return (
      <>
        <Header
          title={prettifyPageFileName(fileName)}
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.pageEditorSidebar}>
            <SimpleMDE
              onChange={this.onEditorChange}
              value={editorValue}
              options={{
                hideIcons: ['preview', 'side-by-side', 'fullscreen'],
                showIcons: ['code', 'table'],
              }}
            />
          </div>
          <div className={editorStyles.pageEditorMain}>
            { leftNavPages && (
              <LeftNavPage
                chunk={prependImageSrc(siteName, marked(editorValue))}
                leftNavPages={leftNavPages}
                fileName={fileName}
                title={prettifyPageFileName(fileName)}
              />
            )}
          </div>
        </div>
        <div className={editorStyles.pageEditorFooter}>
          <button type="button" className={elementStyles.blue} onClick={_.throttle(this.updatePage, 2000)}>Save</button>
          <button type="button" className={elementStyles.warning} onClick={_.throttle(this.deletePage, 2000)}>Delete</button>
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
