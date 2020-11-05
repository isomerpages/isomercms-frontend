import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OverviewCard from '../components/OverviewCard';
import FolderCard from '../components/FolderCard'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { prettifyPageFileName } from '../utils';

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Workspace = ({ match, location }) => {
    const [collections, setCollections] = useState([])
    const [unlinkedPages, setUnlinkedPages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const collectionsResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/collections`);
            setCollections(collectionsResp.data?.collections)

            const unlinkedPagesResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/unlinkedPages`);
            setUnlinkedPages(unlinkedPagesResp.data?.pages)
        }
        fetchData()
    }, [])

    const { siteName } = match.params;
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
                {/* Homepage */}
                <div className={contentStyles.folderContainerBoxes}>
                    <div className={contentStyles.boxesContainer}>
                        <FolderCard
                            displayText={"Homepage"}
                            settingsToggle={() => {}}
                            key={"homepage"}
                            isHomepage={true}
                            isCollection={false}
                            siteName={siteName}
                        />
                    </div>
                </div>
                {/* Segment divider  */}
                <hr className="w-100 mt-3 mb-5" />
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
                                    isHomepage={false}
                                    isCollection={true}
                                    siteName={siteName}
                                    itemIndex={collectionIdx}
                                />
                            ))
                            : 'Loading Collections...'
                        }
                    </div>
                </div>
                {/* Segment divider  */}
                <hr className="invisible w-100 mt-3 mb-5" />
                {/* Pages title */}
                <div className={contentStyles.segment}>
                    Pages
                </div>
                {/* Pages */}
                <div className={contentStyles.contentContainerBoxes}>
                    {/* Display loader if pages have not been retrieved from API call */}
                    { unlinkedPages
                        ? (
                        <div className={contentStyles.boxesContainer}>
                            {
                                unlinkedPages.length > 0
                                ? unlinkedPages.map((page, pageIdx) => (
                                    <OverviewCard
                                        title={prettifyPageFileName(page.fileName)}
                                        key={page.fileName}
                                        itemIndex={pageIdx}
                                        settingsToggle={() => {}}
                                        category={page.collectionName ? page.collectionName : ''}
                                        siteName={siteName}
                                        fileName={page.fileName}
                                        collectionName={page.collectionName}
                                    />
                                ))
                                : null
                            }
                        </div>
                        )
                        : 'Loading Pages...'
                    }
                </div>
            </div>
            {/* main section ends here */}
          </div>
        </>
      );
}

export default Workspace