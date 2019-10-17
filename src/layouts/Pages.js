import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Pages extends Component {
  state = {
    pages: [],
    newPageName: null
  }

  async componentDidMount() {
    try {
      const { siteName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const pages = resp.data.pages
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
    const { siteName } = this.props.match.params
    return (
      <div>
        <Link to={`/sites`}>Back to Sites</Link>
        <hr />
        <h2>{siteName}</h2>
        <ul>
          <li>
            <Link to={`/sites/${siteName}/pages`}>Pages</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/collections`}>Collections</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/images`}>Images</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/files`}>Files</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/menus`}>Menus</Link>
          </li>
        </ul>
        <hr />
        <h3>Pages</h3>
        {pages.length > 0 ?
          pages.map(page => {
            return (
              <li>
                <Link to={`/sites/${siteName}/pages/${page.fileName}`}>{page.fileName}</Link>
              </li>
            )
          }) :
          'No pages'
        }
        <br />
        <input placeholder="New page name" onChange={this.updateNewPageName} />
        <Link to={`/sites/${siteName}/pages/${newPageName}`}>Create new page</Link>
      </div>
    )
  }
}