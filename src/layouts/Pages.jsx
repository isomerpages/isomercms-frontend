import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import PageCard from '../components/PageCard';
import Header from '../components/Header';
import '../styles/isomer-cms/style.scss';
import '../styles/isomer-cms/pages/admin.scss';
import '../styles/isomer-cms/pages/admin-content.scss';


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

        {/* header start, to move into header component */}
        <Header></Header>

        {/* main bottom section */}
        <div class="wrapper">


          {/* sidebar starts here */}
          <div class="admin-sidebar">
              <div class="site-intro">
                <div class="site-name">{siteName}</div>
                <div class="site-date">Updated 2 days ago</div>
              </div>
              <div class="sidebar-navigation">
                <ul>
                  <li className="active" >
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
              </div>
          </div>
          {/* sidebar ends here */}

          {/* main section starts here */}
          <div class="main-section">
            <div class="section-header">
              <h1 class="section-title">Pages</h1>
              <button id="buttonCreatePage" class="blue">Create New Page</button>
            </div>

            <div class="content-container-bars">

              <ul>
                {pages.length > 0
                  ? pages.map((page) => (
                    <li>
                      <PageCard
                        fileName={page.fileName}
                        siteName={siteName}
                      />
                    </li>
                  ))
                  : 'Loading Pages...'}
              </ul>
              <br />
              <input placeholder="New page name" onChange={this.updateNewPageName} />
              <Link to={`/sites/${siteName}/pages/${newPageName}`}>Create new page</Link>
            </div>
          </div>
          {/* main section ends here */}
        </div>

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
