import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      newPageName: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      const { images } = resp.data;
      this.setState({ images });
    } catch (err) {
      console.log(err);
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault();
    this.setState({ newPageName: event.target.value });
  }

  render() {
    const { images, newPageName } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;
    return (
      <div>
        <Link to="/sites">Back to Sites</Link>
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
        <h3>Images</h3>
        {images.length > 0
          ? images.map((image) => (
            <li>
              <Link to={`/sites/${siteName}/images/${image.fileName}`}>{image.fileName}</Link>
            </li>
          ))
          : 'No images'}
        <br />
        <input placeholder="New image name" onChange={this.updateNewPageName} />
        <Link to={`/sites/${siteName}/images/${newPageName}`}>Create new image</Link>
      </div>
    );
  }
}

Images.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
