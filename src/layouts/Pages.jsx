import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PageSettingsModal from '../components/PageSettingsModal';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import { prettifyPageFileName } from '../utils';

// Constants
const RADIX_PARSE_INT = 10;

const PageCard = ({
  siteName, pageName, pageIndex, settingsToggle,
}) => (
  <li>
    <Link to={`/sites/${siteName}/pages/${pageName}`}>{prettifyPageFileName(pageName)}</Link>
    <button type="button" onClick={settingsToggle} id={`settings-${pageIndex}`}>
      <i id={`settingsIcon-${pageIndex}`} className="bx bx-cog" />
    </button>
  </li>
);

export default class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      settingsIsActive: false,
      selectedFileName: '',
      createNewPage: false,
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
      this.setState({ pages: pages.map((page) => page.fileName) });
    } catch (err) {
      console.log(err);
    }
  }

  settingsToggle = (event) => {
    const { id } = event.target;
    const idArray = id.split('-');

    // Create new page
    if (idArray[1] === 'NEW') {
      this.setState((currState) => ({
        settingsIsActive: !currState.settingsIsActive,
        selectedFileName: '',
        createNewPage: true,
      }));
    } else {
      // Modify existing page frontmatter
      const pageIndex = parseInt(idArray[1], RADIX_PARSE_INT);

      this.setState((currState) => ({
        settingsIsActive: !currState.settingsIsActive,
        selectedFileName: currState.settingsIsActive ? '' : currState.pages[pageIndex],
        createNewPage: false,
      }));
    }
  }

  render() {
    const {
      pages, selectedFileName, settingsIsActive, createNewPage,
    } = this.state;
    const { match, location } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <Header />

        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          {/* Page settings modal */}
          { settingsIsActive
            ? (
              <PageSettingsModal
                settingsToggle={this.settingsToggle}
                siteName={siteName}
                fileName={selectedFileName}
                isNewPage={createNewPage}
              />
            )
            : null}
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Pages</h1>
              <button
                type="button"
                className={elementStyles.blue}
                id="settings-NEW"
                onClick={this.settingsToggle}
              >
Create New Page
              </button>
            </div>

            <div className={contentStyles.contentContainerBars}>

              {/* Page cards */}
              <ul>
                <li>
                  <Link to={`/sites/${siteName}/homepage`}>Homepage</Link>
                </li>
                {pages.length > 0
                  ? pages.map((pageName, pageIndex) => (
                    <PageCard
                      siteName={siteName}
                      pageName={pageName}
                      pageIndex={pageIndex}
                      settingsToggle={this.settingsToggle}
                    />
                  ))
                  : 'Loading Pages...'}
              </ul>
              {/* End of page cards */}
            </div>
          </div>
          {/* main section ends here */}
        </div>
      </>
    );
  }
}

PageCard.propTypes = {
  siteName: PropTypes.string.isRequired,
  pageName: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  settingsToggle: PropTypes.func.isRequired,
};

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
