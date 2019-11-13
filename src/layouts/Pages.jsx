import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import PageCard from '../components/PageCard';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

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
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Pages</h1>
              <button type="button" className={elementStyles.blue}>Create New Page</button>
            </div>

            <div className={contentStyles.contentContainerBars}>

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
