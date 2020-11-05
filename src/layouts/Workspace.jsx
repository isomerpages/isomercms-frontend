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


const Workspace = ({ match, location }) => {
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
                <h1 className={contentStyles.sectionTitle}>My Workspace</h1>
              </div>
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span><strong>Pro tip:</strong> Organise this workspace by moving pages into folders</span>
              </div>

  
              <div className={contentStyles.contentContainerBoxes}>
                {/* Page cards */}
                {/* Display loader if pages have not been retrieved from API call */}
                    <div className={contentStyles.boxesContainer}>
                      <FolderCard
                        displayText={"Homepage"}
                        link={`/sites/${siteName}/homepage`}
                        itemIndex={0}
                        settingsToggle={() => {}}
                        key={"homepage"}
                        isHomepage={true}
                      />
                    </div>
                {/* End of page cards */}
              </div>
            </div>
            {/* main section ends here */}
          </div>
        </>
      );
}

export default Workspace