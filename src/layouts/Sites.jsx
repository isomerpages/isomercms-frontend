import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteNames: [],
    };
  }

  async componentDidMount() {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      const { siteNames } = resp.data;
      this.setState({ siteNames });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { siteNames } = this.state;
    return (
      <div>
        <h1>Sites</h1>
        {siteNames.map((siteName) => (
          <li>
            <Link to={`/sites/${siteName}/pages`}>{siteName}</Link>
          </li>
        ))}
      </div>
    );
  }
}
