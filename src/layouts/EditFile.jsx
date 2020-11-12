import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import { changeFileName } from '../utils';
import styles from '../styles/App.module.scss';

export default class EditFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      sha: null,
      tempFileName: '',
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}`, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      this.setState({ content, sha });
    } catch (err) {
      console.log(err);
    }
  }

  createPage = async () => {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const base64Content = Base64.encode((this.contentBox).innerHTML);
      const params = {
        documentName: fileName,
        content: base64Content,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, params, {
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
      const base64Content = Base64.encode((this.contentBox).innerHTML);
      const { state } = this;
      const params = {
        content: base64Content,
        sha: state.sha,
      };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}`, params, {
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}`, {
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
      const { content, sha, tempFileName } = this.state;
      const newFileName = tempFileName;
      const params = {
        content,
        sha,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }


  render() {
    const { content, sha } = this.state;
    const { match } = this.props;
    const { fileName } = match.params;
    return (
      <>
        <h3>
          Editing file
          {' '}
          {fileName}
        </h3>
        <button type="button" className='ml-auto' onClick={this.deletePage}>Delete</button>
        <br />
        <br />
        { sha
          ? (
            <>
              <div className={styles.edit} contentEditable="true" ref={(node) => { this.contentBox = node; }}>
                {Base64.decode(content)}
              </div>
              <button type="button" onClick={this.updatePage}>Save</button>
            </>
          )
          : (
            <>
              <div className={styles.edit} contentEditable="true" ref={(node) => { this.contentBox = node; }} />
              <button type="button" onClick={this.createPage}>Save</button>
            </>
          )}
        <br />
        <br />
        <input placeholder="New file name" onChange={(event) => changeFileName(event, this)} />
        <button type="button" onClick={this.renamePage}>Rename</button>
      </>
    );
  }
}

EditFile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      fileName: PropTypes.string,
      newFileName: PropTypes.string,
    }),
  }).isRequired,
};
