import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { Link } from "react-router-dom";
import axios from 'axios';
import base64 from 'base-64';
import styles from '../App.module.css';

export default class EditPage extends Component {
  state = {
    content: null,
    sha: null
  }

  async componentDidMount() {
    try {
      const { siteName, fileName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const { content, sha } = resp.data
      this.setState({ content, sha })
    } catch (err) {
      console.log(err)
    }
  }

  createPage = async () => {
    try {
      const { siteName, fileName } = this.props.match.params
      const base64Content = base64.encode(ReactDOM.findDOMNode(this.refs.contentBox).innerHTML)
      const params = {
        pageName: fileName,
        content: base64Content,
      }
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, params, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const { content, sha } = resp.data
      this.setState({ content, sha })
    } catch (err) {
      console.log(err)
    }
  }

  updatePage = async () => {
    try {
      const { siteName, fileName } = this.props.match.params
      const base64Content = base64.encode(ReactDOM.findDOMNode(this.refs.contentBox).innerHTML)
      const params = {
        content: base64Content,
        sha: this.state.sha
      }
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const { content, sha } = resp.data
      this.setState({ content, sha })
    } catch (err) {
      console.log(err)
    }
  }

  deletePage = async () => {
    try {
      const { siteName, fileName } = this.props.match.params
      const params = {
        sha: this.state.sha
      }
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, { 
        data: params,
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  renamePage = async () => {
    try {
      const { siteName, fileName } = this.props.match.params
      const newFileName = ReactDOM.findDOMNode(this.refs.newFileName).value
      const params = {
        content: this.state.content,
        sha: this.state.sha
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  render(){
    const { fileName } = this.props.match.params
    const { content, sha } = this.state
    return (
      <React.Fragment>
        <h3>
          Editing page {fileName}
        </h3>
        { sha ?
          <React.Fragment>
            <div className={styles.edit} contenteditable="true" ref="contentBox">
              {base64.decode(content)}
            </div>
            <button onClick={this.updatePage}>Save</button>
          </React.Fragment>
          : 
          <React.Fragment>
            <div className={styles.edit} contenteditable="true" ref="contentBox">
            </div> 
            <button onClick={this.createPage}>Save</button>
          </React.Fragment>         
        }
        <br />
        <br />
        <button onClick={this.deletePage}>Delete</button>
        <br />
        <br />
        <input placeholder="New file name" ref="newFileName" />
        <button onClick={this.renamePage}>Rename</button>
      </React.Fragment>
    )
  }
}