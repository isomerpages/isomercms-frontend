import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import siteStyles from '../styles/isomer-cms/pages/sites.scss';


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
      <>
        <Header showButton={false} />
        <div>
          <h1>Sites</h1>
          {siteNames.map((siteName) => (
            <li>
              <Link to={`/sites/${siteName}/pages`}>{siteName}</Link>
            </li>
          ))}
        </div>
      </>
    );
  }
}
