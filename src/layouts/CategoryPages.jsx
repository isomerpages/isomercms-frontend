import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CollectionPagesSection from '../components/CollectionPagesSection'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

//Import utils
import { retrieveResourceFileMetadata } from '../utils.js'

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

// Determine whether the back button in the header should point to Workspace or Resources
const getBackButtonInfo = (pathname) => {
  const pathnameArr = pathname.split('/')
  if (pathnameArr[3] === 'collections') return {
    backButtonLabel: 'My Workspace',
    backButtonUrl: 'workspace',
  }
  if (pathnameArr[3] === 'resources') return {
    backButtonLabel: 'Resources',
    backButtonUrl: 'resources',
  }
}

const CategoryPages = ({ match, location, isResource }) => {
  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(location.pathname)
  const { collectionName, siteName } = match.params;

  const [categoryPages, setCategoryPages] = useState()

  useEffect(() => {
      const fetchData = async () => {
        if (isResource) {
          const resourcePagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${collectionName}`);
          const { resourcePages } = resourcePagesResp.data;

          if (resourcePages.length > 0) {
            const retrievedResourcePages = resourcePages.map((resourcePage) => {
              const { title, date } = retrieveResourceFileMetadata(resourcePage.fileName);
              return {
                title,
                date,
                fileName: resourcePage.fileName,
              };
            });
            setCategoryPages(retrievedResourcePages)
          } else {
            setCategoryPages([])
          }
        } else {
          const collectionsResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${collectionName}`);
          setCategoryPages(collectionsResp.data?.collectionPages)
        }
      }
      fetchData()
  }, [])

  return (
      <>
        <Header
          backButtonText={`Back to ${backButtonLabel}`}
          backButtonUrl={`/sites/${siteName}/${backButtonUrl}`}
        />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />
          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
              {/* Collection title */}
              <div className={contentStyles.sectionHeader}>
                  <h1 className={contentStyles.sectionTitle}>{collectionName}</h1>
              </div>
              {/* Collection pages */}
              <CollectionPagesSection
                  collectionName={collectionName}
                  pages={categoryPages}
                  siteName={siteName}
                  isResource={isResource}
              />
          </div>
          {/* main section ends here */}
        </div>
      </>
  );
}

export default CategoryPages

CategoryPages.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        siteName: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
};