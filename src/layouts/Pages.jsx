import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import PageCard from '../components/PageCard';
import '../styles/isomer-cms/header.scss';


export default class Pages extends Component {
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
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, {
        withCredentials: true,
      });
      const { pages } = resp.data;
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
    const { siteName } = match.params;
    return (
      <div>
        <div className="header">
          <div className="header-left">
            <a href="/sites"><button><i className='bx bx-chevron-left'></i>Back to Sites</button></a>
          </div>
          <div className="header-center">
            <div className="logo">
              <img src={process.env.PUBLIC_URL + '/img/logo.svg'}/>
            </div>
          </div>
          <div className="header-right">
            <button className="blue">
              Log Out
            </button>
          </div>
        </div>

        <hr />
        <h2>{siteName}</h2>
        <ul>
          <li>
            <a href={`/sites/${siteName}/pages`}><i className="bx bx-chevron-left"></i>jsadhiasdkahd</a>
            <Link to={`/sites/${siteName}/pages`}>Pages</Link>
            <i className="bx bx-chevron-left"></i>

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
        {pages.length > 0
          ? pages.map((page) => (
            <li>
              <PageCard
                fileName={page.fileName}
                siteName={siteName}
              />
            </li>
          ))
          : 'No pages'}
        <br />
        <input placeholder="New page name" onChange={this.updateNewPageName} />
        <Link to={`/sites/${siteName}/pages/${newPageName}`}>Create new page</Link>
      </div>
    );
  }
}

Pages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
