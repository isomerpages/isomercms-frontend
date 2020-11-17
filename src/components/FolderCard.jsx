import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const FolderCard = ({
  displayText,
  settingsToggle,
  itemIndex,
  pageType,
  siteName,
  category,
}) => {
  const generateLink = () => {
    switch(pageType) {
      case 'homepage': 
        return `/sites/${siteName}/homepage`
      case 'collection':
        return `/sites/${siteName}/collections/${category}`
      case 'resources':
        return `/sites/${siteName}/resources/${category}`
      case 'contact-us':
        return `/sites/${siteName}/contact-us`
      default:
        return ''
    }
  }

  return (
    <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`} to={generateLink()}>
      <div id={itemIndex} className={contentStyles.folderInfo}>
        <i className={`bx bx-md text-dark ${pageType === 'homepage' ? 'bxs-home-circle' : 'bxs-folder'}`} />
        <span className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}>{displayText}</span>
        {
          pageType === 'homepage'
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