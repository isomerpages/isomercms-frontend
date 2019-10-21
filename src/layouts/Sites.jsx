import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Sites extends Component {
  state = {
    siteNames: []
  }

  async componentDidMount() {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites`, { 
        withCredentials: true, 
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      const siteNames = resp.data.siteNames
      this.setState({ siteNames })
    } catch (err) {
      console.log(err)
    }
  }

  render(){
    const siteNames = this.state.siteNames
    return (
      <div>
        <h1>Sites</h1>
        {siteNames.map(siteName => {
          return (
            <li>
              <Link to={`/sites/${siteName}/pages`}>{siteName}</Link>
            </li>
          )
        })}
      </div>
    )
  }
}