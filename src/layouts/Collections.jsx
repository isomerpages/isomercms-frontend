import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      newCollectionName: null,
      deleteCollectionName: null,
      oldCollectionName: null,
      renameCollectionName: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      const { collections } = resp.data;
      this.setState({ collections });
    } catch (err) {
      console.log(err);
    }
  }

  createCollection = async () => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const { newCollectionName: collectionName } = this.state;
      const params = {
        collectionName,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`, params, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  deleteCollection = async () => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const { deleteCollectionName: collectionName } = this.state;
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  renameCollection = async () => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const { oldCollectionName, renameCollectionName } = this.state;
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${oldCollectionName}/rename/${renameCollectionName}`, '', {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  updateNewCollectionName = (event) => {
    event.preventDefault();
    this.setState({ newCollectionName: event.target.value });
  }

  updateDeleteCollectionName = (event) => {
    event.preventDefault();
    this.setState({ deleteCollectionName: event.target.value });
  }

  updateDeleteCollectionName = (event) => {
    event.preventDefault();
    this.setState({ deleteCollectionName: event.target.value });
  }

  updateOldCollectionName = (event) => {
    event.preventDefault();
    this.setState({ oldCollectionName: event.target.value });
  }

  updateRenameCollectionName = (event) => {
    event.preventDefault();
    this.setState({ renameCollectionName: event.target.value });
  }

  render() {
    const { collections } = this.state;
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
        <h3>Collections</h3>
        {collections.length > 0
          ? collections.map((collection) => (
            <li>
              <Link to={`/sites/${siteName}/collections/${collection}`}>{collection}</Link>
            </li>
          ))
          : 'No collections'}
        <br />
        <br />
        <input placeholder="New collection name" onChange={this.updateNewCollectionName} />
        <button type="button" onClick={this.createCollection}>Create new collection</button>
        <br />
        <br />
        <input placeholder="Collection to be deleted" onChange={this.updateDeleteCollectionName} />
        <button type="button" onClick={this.deleteCollection}>Delete collection</button>
        <br />
        <br />
        <input placeholder="Collection to be renamed" onChange={this.updateOldCollectionName} />
        <input placeholder="New name of collection" onChange={this.updateRenameCollectionName} />
        <button type="button" onClick={this.renameCollection}>Rename collection</button>
      </div>
    );
  }
}

Collections.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
