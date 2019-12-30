import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const MediaUploadCard = ({ onClick, type }) => (
  <button
    type="button"
    id="settings-NEW"
    onClick={onClick}
    className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew} ${mediaStyles.mediaCardDimensions}`}
  >
    <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
    <h2 id="settingsText-NEW">
      Upload
      {' '}
      {type}
    </h2>
  </button>
);

MediaUploadCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default MediaUploadCard;
