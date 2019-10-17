import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Images extends Component {
  state = {
    images: [],
    newPageName: null
  }

  async componentDidMount() {
    try {
      const { siteName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const images = resp.data.images
      this.setState({ images })
    } catch (err) {
      console.log(err)
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault()
    this.setState({ newPageName: event.target.value})
  }

  render(){
    const { images, newPageName } = this.state
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
        <h3>Images</h3>
        {images.length > 0 ?
          images.map(image => {
            return (
              <li>
                <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/images/${image.fileName}`}>{image.fileName}</Link>
              </li>
            )
          }) :
          'No images'
        }
        <br />
        <input placeholder="New image name" onChange={this.updateNewPageName} />
        <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/images/${newPageName}`}>Create new image</Link>
      </div>
    )
  }
}