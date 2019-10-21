import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class CollectionPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      newPageName: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, collectionName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}`, {
        withCredentials: true
      });
      const pages = resp.data.collectionPages;
      this.setState({ pages });
    } catch (err) {
      console.log(err);
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault();
    this.setState({ newPageName: event.target.value });
  }

  render() {
    const { pages, newPageName } = this.state;
    const { match } = this.props;
    const { siteName, collectionName } = match.params;
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
        <h3>
Pages in Collection
          {collectionName}
        </h3>
        {pages.length > 0
          ? pages.map((page) => (
            <li>
              <Link to={`/sites/${siteName}/collections/${collectionName}/${page.fileName}`}>{page.fileName}</Link>
            </li>
          ))
          : 'No pages'}
        <br />
        <input placeholder="New page name" onChange={this.updateNewPageName} />
        <Link to={`/sites/${siteName}/collections/${collectionName}/${newPageName}`}>Create new page</Link>
      </div>
    );
  }
}

CollectionPages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      collectionName: PropTypes.string,
    }),
  }).isRequired,
};
