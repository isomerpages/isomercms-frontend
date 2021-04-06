import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CollectionPagesSection from '../components/CollectionPagesSection'
import FolderCard from '../components/FolderCard'
import FolderCreationModal from '../components/FolderCreationModal'
import FolderOptionButton from '../components/folders/FolderOptionButton'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { DEFAULT_RETRY_MSG, prettifyPageFileName } from '../utils';
import { errorToast } from '../utils/toasts';
import { getPages, getAllCategories } from '../api';
import { PAGE_CONTENT_KEY, FOLDERS_CONTENT_KEY } from '../constants'

// Import hooks
import useSiteColorsHook from '../hooks/useSiteColorsHook';

const Workspace = ({ match, location }) => {
    const { retrieveSiteColors } = useSiteColorsHook()

    const { siteName } = match.params;

    const [collections, setCollections] = useState()
    const [unlinkedPages, setUnlinkedPages] = useState()
    const [contactUsCard, setContactUsCard] = useState(false)
    const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)

    // get unlinked pages
    const { refetch: refetchPages } = useQuery(
      [PAGE_CONTENT_KEY, { siteName }],
      () => getPages({ siteName }),
      {
        retry: false,
        onError: () => errorToast(`There was a problem trying to load your pages. ${DEFAULT_RETRY_MSG}`),
        onSuccess: (pagesResp) => {
          if (pagesResp.some(page => page.fileName === 'contact-us.md')) setContactUsCard(true)
          setUnlinkedPages(pagesResp.filter(page => page.fileName !== 'contact-us.md') || [])
        },
      },
    )
    
    // get all folders
    const { refetch: refetchFolders } = useQuery(
      [FOLDERS_CONTENT_KEY, { siteName, isResource: false }],
      async () => getAllCategories({ siteName }),
      {
        onError: () => errorToast(`The folders data could not be retrieved. ${DEFAULT_RETRY_MSG}`),
        onSuccess: (allFolders) => setCollections(allFolders.collections || [])
      },
    )

    useEffect(() => {
      let _isMounted = true
      const fetchData = async () => {
        try {
          await retrieveSiteColors(siteName)
        } catch (e) {
          console.log(e)
        }
      }
      fetchData()
      return () => { _isMounted = false }
    }, [])

    return (
        <>
          {
            isFolderCreationActive &&
            <FolderCreationModal
              existingSubfolders={collections}
              pagesData={unlinkedPages.map(page => {
                const newPage = { 
                  ...page,
                  title: page.fileName,
                }
                return newPage
              })}
              siteName={siteName}
              setIsFolderCreationActive={setIsFolderCreationActive}
            />
          }
          <Header 
            siteName={siteName}
          />
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
              {/* Homepage, Nav bar and Contact Us */}
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
                    displayText={"Navigation Bar"}
                    settingsToggle={() => {}}
                    key={"nav"}
                    pageType={"nav"}
                    siteName={siteName}
                  />
                  { contactUsCard && 
                    <FolderCard
                      displayText={"Contact Us"}
                      settingsToggle={() => {}}
                      key={"contact-us"}
                      pageType={"contact-us"}
                      siteName={siteName}
                    />
                  }
                </div>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Folders title */}
              <div className={contentStyles.segment}>
                Folders
              </div>
              {/* Folders */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  <FolderOptionButton title="Create new folder" option="create-sub" isSubfolder={false} onClick={() => setIsFolderCreationActive(true)}/>
                  {
                    collections
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
                    : 'Loading Folders...'
                  }
                </div>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="invisible w-100 mt-3 mb-5" />
              </div>
              {/* Pages title */}
              <div className={contentStyles.segment}>
                Unlinked Pages
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-info-circle text-dark" />
                <span><strong className="ml-1">Note:</strong> Unlinked pages are pages which do not belong to any collection.</span>
              </div>
              {/* Pages */}
              <CollectionPagesSection
                pages={unlinkedPages}
                siteName={siteName}
                refetchPages={refetchPages}
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
  