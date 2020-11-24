import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CollectionPagesSection from '../components/CollectionPagesSection'
import FolderCard from '../components/FolderCard'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { prettifyPageFileName } from '../utils';

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Workspace = ({ match, location }) => {
    const { siteName } = match.params;

    const [collections, setCollections] = useState([])
    const [unlinkedPages, setUnlinkedPages] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const collectionsResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/collections`);
            setCollections(collectionsResp.data?.collections)

            const unlinkedPagesResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/unlinkedPages`);
            setUnlinkedPages(unlinkedPagesResp.data?.pages)
        }
        fetchData()
    }, [])

    return (
        <>
          <Header />
          {/* main bottom section */}
          <div className={elementStyles.wrapper}>
            <Sidebar siteName={siteName} currPath={location.pathname} />
            {/* main section starts here */}
            <div className={contentStyles.mainSection}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>My Workspace</h1>
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span><strong className="ml-1">Pro tip:</strong> Organise this workspace by moving pages into folders</span>
              </div>
              {/* Homepage and Contact Us */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  <FolderCard
                    displayText={"Homepage"}
                    settingsToggle={() => {}}
                    key={"homepage"}
                    pageType={"homepage"}
                    siteName={siteName}
                  />
                  <FolderCard
                    displayText={"Contact Us"}
                    settingsToggle={() => {}}
                    key={"contact-us"}
                    pageType={"contact-us"}
                    siteName={siteName}
                  />
                </div>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Collections title */}
              <div className={contentStyles.segment}>
                Collections
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-info-circle text-dark" />
                <span><strong className="ml-1">Note:</strong> Collections cannot be empty, create a page first to create a collection.</span>
              </div>
              {/* Collections */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {
                    collections && collections.length > 0
                    ? collections.map((collection, collectionIdx) => (
                      <FolderCard
                        displayText={prettifyPageFileName(collection)}
                        settingsToggle={() => {}}
                        key={collection}
                        pageType={"collection"}
                        siteName={siteName}
                        category={collection}
                        itemIndex={collectionIdx}
                      />
                    ))
                    : 'Loading Collections...'
                  }
                </div>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="invisible w-100 mt-3 mb-5" />
              </div>                {/* Pages title */}
              <div className={contentStyles.segment}>
                Pages
              </div>
              {/* Pages */}
              <CollectionPagesSection
                pages={unlinkedPages}
                siteName={siteName}
              />
            </div>
            {/* main section ends here */}
          </div>
        </>
    );
}

export default Workspace

Workspace.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        siteName: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
};
  