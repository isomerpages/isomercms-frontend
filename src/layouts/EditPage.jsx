import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import base64 from 'base-64';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      sha: null,
      editorValue: '',
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
      this.setState({
        content,
        sha,
        editorValue: base64.decode(content),
      });
    } catch (err) {
      console.log(err);
    }
  }

  createPage = async () => {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const { editorValue } = this.state;

      const base64Content = base64.encode(editorValue);
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
      const base64Content = base64.encode(state.editorValue);
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

        <SimpleMDE
          onChange={this.onEditorChange}
          value={editorValue}
        />
        <button type="button" onClick={sha ? this.updatePage : this.createPage}>Save</button>

        <br />
        <br />
        <button type="button" onClick={this.deletePage}>Delete</button>
        <br />
        <br />
        <input placeholder="New file name" ref={(node) => { this.newFileName = node; }} />
        <button type="button" onClick={this.renamePage}>Rename</button>
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
