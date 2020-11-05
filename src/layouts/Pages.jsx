import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ComponentSettingsModal from '../components/ComponentSettingsModal';
import OverviewCard from '../components/OverviewCard';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import { prettifyPageFileName } from '../utils';

// Constants
const RADIX_PARSE_INT = 10;

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
              <ComponentSettingsModal
                modalTitle={"Page Settings"}
                settingsToggle={this.settingsToggle}
                siteName={siteName}
                fileName={selectedFile ? selectedFile.fileName : ''}
                isNewFile={createNewPage}
                type="page"
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
              <ComponentSettingsModal
                modalTitle={"Page Settings"}
                settingsToggle={this.settingsToggle}
                siteName={siteName}
                fileName={selectedFile.fileName}
                category={selectedFile.collectionName}
                type="page"
                isNewFile={false}
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

            <div className={contentStyles.contentContainerBoxes}>
              {/* Page cards */}
              {/* Display loader if pages have not been retrieved from API call */}
              { pages
                ? (
                  <div className={contentStyles.boxesContainer}>
                    <OverviewCard
                      itemIndex={0}
                      title={"Homepage"}
                      key={"homepage"}
                      siteName={siteName}
                      isHomepage={true}
                    />
                    {pages.length > 0
                      ? pages.map((page, pageIndex) => (
                        <OverviewCard
                          title={prettifyPageFileName(page.fileName)}
                          key={page.fileName}
                          itemIndex={pageIndex}
                          settingsToggle={this.settingsToggle}
                          category={page.collectionName ? page.collectionName : ''}
                          siteName={siteName}
                          fileName={page.fileName}
                          collectionName={page.collectionName}
                        />
                      ))
                      : null}
                    </div>
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
