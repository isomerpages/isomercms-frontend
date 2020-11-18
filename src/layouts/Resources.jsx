import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CollectionPagesSection from '../components/CollectionPagesSection'
import FolderCard from '../components/FolderCard'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { prettifyResourceCategory } from '../utils';
import { validateResourceRoomName } from '../utils/validators'
import FormField from '../components/FormField';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Resources = ({ match, location }) => {
  const { siteName } = match.params;

  const [isLoading, setIsLoading] = useState(true)
  const [resourceRoomName, setResourceRoomName] = useState()
  const [newResourceRoomName, setNewResourceRoomName] = useState('')
  const [resourceFolderNames, setResourceFolderNames] = useState()
  const [resourceRoomNameError, setResourceRoomNameError] = useState('')

  useEffect(() => {
    try {
      const fetchData = async () => {
        // Get the resource categories in the resource room
        const resourcesResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/resources`);
        const { resourceRoomName, resources: resourceCategories } = resourcesResp.data;

        if (resourceRoomName) {
          const uniqueResourceFolderNames = resourceCategories ? _.uniq(resourceCategories.map((file) => file.dirName)) : []
          setResourceFolderNames(uniqueResourceFolderNames)
          setResourceRoomName(resourceRoomName)
        }
        setIsLoading(false)
      }
      fetchData()
    } catch (err) {
      console.log(err);
    }
  }, [])

  const resourceRoomNameHandler = (event) => {
    const { value } = event.target;
    const errorMessage = validateResourceRoomName(value)
    setNewResourceRoomName(value)
    if (errorMessage) setResourceRoomNameError(errorMessage)
  }

  const createResourceRoom = async () => {
    try {
      const { siteName } = match.params;
      const params = { resourceRoom: newResourceRoomName };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resource-room`, params);
      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

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
            <h1 className={contentStyles.sectionTitle}>Resources</h1>
          </div>
          {
            isLoading ? 'Loading Resources...'
            :
              resourceRoomName
              ? <>
                  {/* Category title */}
                  <div className={contentStyles.segment}>
                    Resource Categories
                  </div>
                  {/* Info segment */}
                  <div className={contentStyles.segment}>
                    <i className="bx bx-sm bx-info-circle text-dark" />
                    <span><strong className="ml-1">Note:</strong> Categories cannot be empty, create a resource first to create a Category.</span>
                  </div>
                  {/* Categories */}
                  <div className={contentStyles.folderContainerBoxes}>
                    <div className={contentStyles.boxesContainer}>
                      {
                        resourceFolderNames 
                        ? 
                          resourceFolderNames.length > 0
                          ? resourceFolderNames.map((resourceCategory, collectionIdx) => (
                              <FolderCard
                                displayText={prettifyResourceCategory(resourceCategory)}
                                settingsToggle={() => {}}
                                key={resourceCategory}
                                isHomepage={false}
                                isCollection={false}
                                siteName={siteName}
                                category={resourceCategory}
                                itemIndex={collectionIdx}
                              />
                            ))
                          : 'No Resource Categories. Create a resource to add a Category.'
                        : 'Loading Resource Categories...'
                      }
                    </div>
                  </div>
                  {/* Segment divider  */}
                  <div className={contentStyles.segmentDividerContainer}>
                    <hr className="invisible w-100 mt-3 mb-5" />
                  </div>
                  {/* Pages */}
                  <CollectionPagesSection
                    pages={[]}
                    siteName={siteName}
                    isResource={true}
                  />
                </>
              : <>
                  {/* Resource Room does not exist */}
                  <div className={contentStyles.segment}>
                    Create Resource Room
                  </div>
                  {/* Info segment */}
                  <div className={contentStyles.segment}>
                    <i className="bx bx-sm bx-info-circle text-dark" />
                    <span><strong className="ml-1">Note:</strong> You must create a Resource Room before you can create Resources.</span>
                  </div>
                  <FormField
                    className="w-100"
                    value={newResourceRoomName}
                    placeholder="Resource room title"
                    errorMessage={resourceRoomNameError}
                    isRequired={true}
                    onFieldChange={resourceRoomNameHandler}
                    maxWidth={true}
                  />
                  {/* Segment divider  */}
                  <div className={contentStyles.segmentDividerContainer}>
                    <hr className="invisible w-100 mt-3 mb-3" />
                  </div>
                  <button type="button" onClick={createResourceRoom} className={elementStyles.blue}>Create Resource Room</button>
                </>
          }
        </div>
        {/* main section ends here */}
      </div>
    </>
  );
}

export default Resources

Resources.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
  