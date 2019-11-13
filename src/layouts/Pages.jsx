import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PageCard from '../components/PageCard';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/isomer-cms/style.scss';
import '../styles/isomer-cms/pages/admin.scss';
import '../styles/isomer-cms/pages/admin-content.scss';


export default class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
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

  render() {
    const { pages } = this.state;
    const { match, location } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <Header />

        {/* main bottom section */}
        <div className="wrapper">
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className="main-section">
            <div className="section-header">
              <h1 className="section-title">Pages</h1>
              <button type="button" className="blue">Create New Page</button>
            </div>

            <div className="content-container-bars">

              <ul>
                {pages.length > 0
                  ? pages.map((page) => (
                    <PageCard
                      fileName={page.fileName}
                      siteName={siteName}
                    />
                  ))
                  : 'Loading Pages...'}
              </ul>
            </div>
          </div>
          {/* main section ends here */}
        </div>
      </>
    );
  }
}

Pages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
