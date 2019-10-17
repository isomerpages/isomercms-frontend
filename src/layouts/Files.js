import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Files extends Component {
  state = {
    files: [],
    newImageName: null
  }

  async componentDidMount() {
    try {
      const { siteName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const files = resp.data.files
      this.setState({ files })
    } catch (err) {
      console.log(err)
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault()
    this.setState({ newPageName: event.target.value})
  }

  render(){
    const { files, newPageName } = this.state
    const { siteName } = this.props.match.params
    return (
      <div>
        <Link to={`${process.env.PUBLIC_URL}/sites`}>Back to Sites</Link>
        <hr />
        <h2>{siteName}</h2>
        <ul>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/pages`}>Pages</Link>
          </li>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/collections`}>Collections</Link>
          </li>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/images`}>Images</Link>
          </li>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/files`}>Files</Link>
          </li>
          <li>
            <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/menus`}>Menus</Link>
          </li>
        </ul>
        <hr />
        <h3>Files</h3>
        {files.length > 0 ?
          files.map(file => {
            return (
              <li>
                <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/files/${file.fileName}`}>{file.fileName}</Link>
              </li>
            )
          }) :
          'No files'
        }
        <br />
        <input placeholder="New file name" onChange={this.updateNewPageName} />
        <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/documents/${newPageName}`}>Create new file</Link>
      </div>
    )
  }
}