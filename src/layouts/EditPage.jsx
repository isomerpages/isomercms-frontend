import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import yaml from 'js-yaml';
import SimplePage from './SimplePage/SimplePage';
import frontMatterParser from '../utils';
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      sha: null,
      editorValue: '',
      frontMatter: '',
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      // split the markdown into front matter and content
      const { configObj, articleContent } = frontMatterParser(Base64.decode(content));
      this.setState({
        content,
        sha,
        editorValue: articleContent.trim(),
        frontMatter: configObj,
      });
    } catch (err) {
      console.log(err);
    }
  }

  createPage = async () => {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const { editorValue, frontMatter } = this.state;

      // here, we need to add the appropriate front matter before we encode
      // this part needs to be revised to include permalink and other things depending on page type
      const upload = ['---\n', yaml.safeDump(frontMatter), '---\n', editorValue].join('');

      const base64Content = Base64.encode(upload);
      const params = {
        pageName: fileName,
        content: base64Content,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, params, {
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
      const { siteName, fileName } = match.params;
      const { state } = this;
      const { editorValue, frontMatter } = state;

      // here, we need to re-add the front matter of the markdown file
      const upload = ['---\n', yaml.safeDump(frontMatter), '---\n', editorValue].join('');

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const params = {
        content: base64Content,
        sha: state.sha,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      this.setState({ content, sha });
    } catch (err) {
      console.log(err);
    }
  }

  deletePage = async () => {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const { state } = this;
      const params = {
        sha: state.sha,
      };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
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
      const { siteName, fileName } = match.params;
      const { state } = this;
      const newFileName = (this.newFileName).value;
      const params = {
        content: state.content,
        sha: state.sha,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}/rename/${newFileName}`, params, {
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
    const { match } = this.props;
    const { fileName } = match.params;
    const { sha, editorValue } = this.state;
    return (
      <>
        <h3>
          Editing page
          {' '}
          {fileName}
        </h3>
        <div className="d-flex">
          <div className="left-pane p-3">
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
            <input placeholder="New file name" ref={(node) => { this.newFileName = node; }} />
            <button type="button" onClick={this.renamePage}>Rename</button>
          </div>
          <div className="right-pane">
            <section className="bp-section is-small bp-section-pagetitle" style={{ width: '125%' }}>
              <div className="bp-container ">
                <div className="row">
                  <div className="col">
                    <nav className="bp-breadcrumb" aria-label="breadcrumbs">
                      <ul>
                        <li><a href="/"><small>HOME</small></a></li>
                        <li><a href="/employer-faq/"><small>GENERIC BREADCRUMB</small></a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="bp-container">
                <div className="row">
                  <div className="col">
                    <h1 className="has-text-white"><b>Generic Breadcrumb</b></h1>
                  </div>
                </div>
              </div>
            </section>
            <SimplePage chunk={marked(editorValue)} />
          </div>
        </div>

      </>
    );
  }
}

EditPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      fileName: PropTypes.string,
      newFileName: PropTypes.string,
    }),
  }).isRequired,
};
