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
import {DEFAULT_RETRY_MSG, prettifyPageFileName, frontMatterParser} from '../utils';
import { errorToast } from '../utils/toasts';
import { getPages, getAllCategories, getEditPageData } from '../api';
import { PAGE_CONTENT_KEY, FOLDERS_CONTENT_KEY } from '../constants'

// Import hooks
import useSiteColorsHook from '../hooks/useSiteColorsHook';

const CONTACT_US_TEMPLATE_LAYOUT = 'contact_us'

const Workspace = ({ match, location }) => {
    const { retrieveSiteColors } = useSiteColorsHook()

    const { siteName } = match.params;

    const [collections, setCollections] = useState()
    const [unlinkedPages, setUnlinkedPages] = useState()
    const [contactUsCard, setContactUsCard] = useState()
    const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)

    // get page settings details when page is selected (used for editing page settings and deleting)
    const {} = useQuery(
      [PAGE_CONTENT_KEY, { siteName, fileName: 'contact-us.md' }],
      async () => await getEditPageData({ siteName, fileName: 'contact-us.md' }),
      { 
        retry: false,
        onError: () => setContactUsCard(false),
        onSuccess: ({ pageContent: contactUsPageContent }) => {
          const { frontMatter: { layout } } = frontMatterParser(contactUsPageContent)
          setContactUsCard(layout === CONTACT_US_TEMPLATE_LAYOUT) 
        },
      },
    )
    
    // get unlinked pages
    const { refetch: refetchPages } = useQuery(
      [PAGE_CONTENT_KEY, { siteName }],
      () => getPages({ siteName }),
      {
        enabled: contactUsCard !== undefined, // delay until contact page layout query runs
        retry: false,
        onError: () => errorToast(`There was a problem trying to load your pages. ${DEFAULT_RETRY_MSG}`),
        onSuccess: (pagesResp) => {
          if (contactUsCard) setUnlinkedPages(pagesResp.length > 0 ? pagesResp.filter(page => page.fileName !== 'contact-us.md') : [])
          else setUnlinkedPages(pagesResp.length > 0 ? pagesResp : [])
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
              {/* Collections title */}
              <div className={contentStyles.segment}>
                Folders
              </div>
              {
                !collections &&
                <div className={contentStyles.segment}>
                  Loading Folders...
                </div>
              }
              {
                collections && collections.length === 0 &&
                <div className={contentStyles.segment}>
                  There are no folders in this repository.
                </div>
              }
              {/* Folders */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {
                    collections && unlinkedPages && <FolderOptionButton title="Create new folder" option="create-sub" isSubfolder={false} onClick={() => setIsFolderCreationActive(true)}/>
                  }
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
                            existingFolders={collections}
                        />
                    ))
                    : null
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
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-info-circle text-dark" />
                <span><strong className="ml-1">Note:</strong> The pages here do not belong to any folders.</span>
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
  