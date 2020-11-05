import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  isHomepage,
  isCollection,
  siteName,
  category,
}) => {
  const generateLink = () => {
    if (isHomepage) return `/sites/${siteName}/homepage`
    if (isCollection) return `/sites/${siteName}/collections/${category}`
    return `/sites/${siteName}/resources/${category}`
  }

  return (
    <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`} to={generateLink()}>
      <div id={itemIndex} className={contentStyles.folderInfo}>
        <i className={`bx bx-md text-dark ${isHomepage ? 'bxs-home-circle' : 'bxs-folder'}`} />
        <span className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}>{displayText}</span>
        {
          isHomepage
          ? ''
          : (
            <div className={contentStyles.componentIcon}>
              <button
                className={contentStyles.componentIcon}
                type="button"
                id={`settings-folder-${itemIndex}`}
                onClick={(e) => {
                  e.preventDefault();
                  settingsToggle(e)}}
                className={contentStyles.componentIcon}
              >
                <i id={`settingsIcon-${itemIndex}`} className="bx bx-dots-vertical-rounded" />
              </button>
            </div>
          )
        }
      </div>
    </Link>
  )
}

FolderCard.propTypes = {
  displayText: PropTypes.string.isRequired,
  settingsToggle: PropTypes.func.isRequired,
  itemIndex: PropTypes.number,
  isHomepage: PropTypes.bool.isRequired,
  isCollection: PropTypes.bool.isRequired,
  siteName: PropTypes.string.isRequired,
};

export default FolderCard;