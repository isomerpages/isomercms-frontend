import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class CollectionPages extends Component {
  state = {
    pages: [],
    newImageName: null
  }

  async componentDidMount() {
    try {
      const { siteName, collectionName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const pages = resp.data.collectionPages
      this.setState({ pages })
    } catch (err) {
      console.log(err)
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault()
    this.setState({ newPageName: event.target.value})
  }

  render(){
    const { pages, newPageName } = this.state
    const { siteName, collectionName } = this.props.match.params
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
        <h3>Pages in Collection {collectionName}</h3>
        {pages.length > 0 ?
          pages.map(page => {
            return (
              <li>
                <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/collections/${collectionName}/${page.fileName}`}>{page.fileName}</Link>
              </li>
            )
          }) :
          'No pages'
        }
        <br />
        <input placeholder="New page name" onChange={this.updateNewPageName} />
        <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/collections/${collectionName}/${newPageName}`}>Create new page</Link>
      </div>
    )
  }
}