import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const FolderCard = ({
  displayText,
  link,
  settingsToggle,
  itemIndex
}) => (
  <div className={contentStyles.folderContainerBoxes}>
    <div className={contentStyles.boxesContainer}>
      <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`} to={link}>
        <i className="bx bxs-folder" />
        <div id={itemIndex} className={contentStyles.componentInfo}>
          <h1 className={contentStyles.componentFolderName}>{displayText}</h1>
        </div>
        <div className={contentStyles.componentIcon}>
          <button
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
      </Link>
    </div>
  </div>
)

FolderCard.propTypes = {
  type: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  itemIndex: PropTypes.number.isRequired,
};

export default FolderCard;