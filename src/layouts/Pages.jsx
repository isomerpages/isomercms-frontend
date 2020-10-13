import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PageSettingsModal from '../components/PageSettingsModal';
import CollectionPageSettingsModal from '../components/CollectionPageSettingsModal';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import { prettifyPageFileName } from '../utils';

// Constants
const RADIX_PARSE_INT = 10;

const PageCard = ({
  siteName, pageName, pageIndex, settingsToggle, collectionName,
}) => (
  // Set padding to 0 so that Link component takes up the entire element
  // and entire element is clickable
  <li className="p-0">
    <Link
      className="d-flex align-items-center px-5 py-3"
      to={collectionName
        ? `/sites/${siteName}/collections/${collectionName}/${pageName}`
        : `/sites/${siteName}/pages/${pageName}`}
    >
      <div className="mr-auto">{prettifyPageFileName(pageName)}</div>
      <button type="button" onClick={settingsToggle} id={`settings-${pageIndex}`}>
        <i id={`settingsIcon-${pageIndex}`} className="bx bx-cog" />
      </button>
    </Link>
  </li>
);

export default class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: undefined,
      settingsIsActive: false,
      selectedFile: {},
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
      this.setState({ pages });
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
        selectedFile: null,
        createNewPage: true,
      }));
    } else {
      // Modify existing page frontmatter
      const pageIndex = parseInt(idArray[1], RADIX_PARSE_INT);

      this.setState((currState) => ({
        settingsIsActive: !currState.settingsIsActive,
        selectedFile: currState.settingsIsActive ? null : currState.pages[pageIndex],
        createNewPage: false,
      }));
    }
  }

  render() {
    const {
      pages, selectedFile, settingsIsActive, createNewPage,
    } = this.state;

    const { match, location } = this.props;
    const { siteName } = match.params;
    const isCollectionPage = selectedFile && selectedFile.type === 'collection';

    return (
      <>
        <Header />

        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          {/* Page settings modal */}
          { settingsIsActive && !isCollectionPage
            && (
              <PageSettingsModal
                settingsToggle={this.settingsToggle}
                siteName={siteName}
                fileName={selectedFile ? selectedFile.fileName : ''}
                isNewPage={createNewPage}
                pageFilenames={_.chain(pages)
                  .filter({ type: 'simple-page' })
                  .map((page) => page.fileName)
                  .value()}
              />
            )}
          {/**
           * Collection page settings modal
           * This modal only aims to alter the settings for existing collection pages
           * It should not be shown for creation of new pages as
           * that is what `PageSettingsModal` is for
           */}
          { settingsIsActive && isCollectionPage
            && (
              <CollectionPageSettingsModal
                settingsToggle={this.settingsToggle}
                siteName={siteName}
                fileName={selectedFile.fileName}
                collectionName={selectedFile.collectionName}
              />
            )}
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
              {/* Display loader if pages have not been retrieved from API call */}
              { pages
                ? (
                  <ul>
                    {
                    // Set padding of li element to 0 to be compatible with other PageCard
                    // components
                    }
                    <li className="p-0">
                      <Link
                        className="d-flex align-items-center px-5 py-3"
                        to={`/sites/${siteName}/homepage`}
                      >
                        Homepage
                      </Link>
                    </li>
                    {pages.length > 0
                      ? pages.map((page, pageIndex) => (
                        <PageCard
                          siteName={siteName}
                          pageName={page.fileName}
                          pageIndex={pageIndex}
                          settingsToggle={this.settingsToggle}
                          collectionName={page.collectionName ? page.collectionName : ''}
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${page.fileName}-${pageIndex}`}
                        />
                      ))
                      : null}
                  </ul>
                )
                : 'Loading Pages...'}
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
  collectionName: PropTypes.string.isRequired,
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
