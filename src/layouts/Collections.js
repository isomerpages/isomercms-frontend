import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Collections extends Component {
  state = {
    collections: [],
    newCollectionName: null,
    deleteCollectionName: null,
    oldCollectionName: null,
    renameCollectionName: null
  }

  async componentDidMount() {
    try {
      const { siteName } = this.props.match.params
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const collections = resp.data.collections
      this.setState({ collections })
    } catch (err) {
      console.log(err)
    }
  }

  createCollection = async () => {
    try {
      const { siteName } = this.props.match.params
      const params = {
        collectionName: this.state.newCollectionName
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`, params, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  deleteCollection = async () => {
    try {
      const { siteName } = this.props.match.params
      const collectionName = this.state.deleteCollectionName
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  renameCollection = async () => {
    try {
      const { siteName } = this.props.match.params
      const { oldCollectionName, renameCollectionName } = this.state
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${oldCollectionName}/rename/${renameCollectionName}`, '', { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  updateNewCollectionName = (event) => {
    event.preventDefault()
    this.setState({ newCollectionName: event.target.value})
  }

  updateDeleteCollectionName = (event) => {
    event.preventDefault()
    this.setState({ deleteCollectionName: event.target.value})
  }

  updateDeleteCollectionName = (event) => {
    event.preventDefault()
    this.setState({ deleteCollectionName: event.target.value})
  }

  updateOldCollectionName = (event) => {
    event.preventDefault()
    this.setState({ oldCollectionName: event.target.value})
  }

  updateRenameCollectionName = (event) => {
    event.preventDefault()
    this.setState({ renameCollectionName: event.target.value})
  }

  render(){
    const collections = this.state.collections
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
        <h3>Collections</h3>
        {collections.length > 0 ?
          collections.map(collection => {
            return (
              <li>
                <Link to={`${process.env.PUBLIC_URL}/sites/${siteName}/collections/${collection}`}>{collection}</Link>
              </li>
            )
          }) :
          'No collections'
        }
        <br />
        <br />
        <input placeholder="New collection name" onChange={this.updateNewCollectionName} />
        <button onClick={this.createCollection}>Create new collection</button>
        <br />
        <br />
        <input placeholder="Collection to be deleted" onChange={this.updateDeleteCollectionName} />
        <button onClick={this.deleteCollection}>Delete collection</button>
        <br />
        <br />
        <input placeholder="Collection to be renamed" onChange={this.updateOldCollectionName} />
        <input placeholder="New name of collection" onChange={this.updateRenameCollectionName} />
        <button onClick={this.renameCollection}>Rename collection</button>
      </div>
    )
  }
}