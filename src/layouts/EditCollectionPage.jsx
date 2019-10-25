import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import styles from '../styles/App.module.scss';

export default class EditCollectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      sha: null,
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
      this.setState({ content, sha });
    } catch (err) {
      console.log(err);
    }
  }

  createPage = async () => {
    try {
      const { match } = this.props;
      const { siteName, collectionName, fileName } = match.params;
      const base64Content = Base64.encode(this.contentBox.innerHTML);
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
      const { state } = this;
      const base64Content = Base64.encode(this.contentBox.innerHTML);
      const params = { content: base64Content, sha: state.sha };
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`, params, {
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
      const { siteName, fileName, collectionName } = match.params;
      const { content, sha } = this.state;
      const newFileName = this.newFileName.value;
      const params = { content, sha };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { content, sha } = this.state;
    const { match } = this.props;
    const { collectionName, fileName } = match.params;
    return (
      <>
        <h3>
          {' '}
Editing page
          {fileName}
          {' '}
in collection
          {collectionName}
          {' '}

        </h3>
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
        <button type="button" onClick={this.deletePage}>Delete</button>
        <br />
        <br />
        <input placeholder="New file name" ref={(node) => { this.newFileName = node; }} />
        <button type="button" onClick={this.renamePage}>Rename</button>
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
};
