import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { ReactQueryDevtools } from 'react-query/devtools'

// Import components
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FolderOptionButton from '../components/folders/FolderOptionButton';
import FolderContent from '../components/folders/FolderContent';

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const Folders = ({ match, location }) => {
    const { siteName, folderName, subfolderName } = match.params;

    const [isRearrangeActive, setIsRearrangeActive] = useState(false)

    const toggleRearrange = () => { setIsRearrangeActive((prevState) => !prevState) }

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
                <h1 className={contentStyles.sectionTitle}>{folderName}</h1>
              </div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-bulb text-dark" />
                <span><strong className="ml-1">Pro tip:</strong> You can make a new section by creating sub folders</span>
              </div>
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="w-100 mt-3 mb-5" />
              </div>
              {/* Collections title */}
              <div className={contentStyles.segment}>
                <span>
                    My workspace >
                    {
                        folderName && !subfolderName
                        ? <strong className="ml-1"> {folderName}</strong>
                        : null
                    }
                    {
                        folderName && subfolderName
                        ? (
                            <span>{` ${folderName}`} > <strong className="ml-1"> {subfolderName}</strong></span>
                        )
                        : null
                    }
                </span>
              </div>
              {/* Options */}
              <div className={contentStyles.contentContainerFolderRowMargin}>
                <FolderOptionButton title="Rearrange items" isSelected={isRearrangeActive} onClick={toggleRearrange} option="rearrange" />
                <FolderOptionButton title="Create new page" option="create-page" />
                <FolderOptionButton title="Create new sub-folder" option="create-sub" />
              </div>
              {/* Collections content */}
              <FolderContent />
            </div>
            {/* main section ends here */}
            {
                process.env.REACT_APP_ENV === 'LOCAL_DEV' && <ReactQueryDevtools initialIsOpen={false} />
            }
          </div>
        </>
    );
}


export default Folders

Folders.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        siteName: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
};
  