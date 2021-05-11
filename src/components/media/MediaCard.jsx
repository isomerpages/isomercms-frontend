import React from 'react';
import PropTypes from 'prop-types';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';

const MediaCard = ({
  type, siteName, onClick, media, isSelected, canShowEditIcon,
}) => (
  <div
    className={isSelected ? mediaStyles.selectedMediaCard : mediaStyles.mediaCard}
    key={media.path}
  >
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(); }}>
      {
        type === 'images' && (
          <div className={mediaStyles.mediaCardImagePreviewContainer}>
            <img
              className={mediaStyles.mediaCardImage}
              alt={`${media.fileName}`}
              // The sanitise parameter is for SVGs. It converts the raw svg data into an image
              src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${media.path}${media.path.endsWith('.svg') ? '?sanitize=true' : ''}`}
            />
          </div>
        )
      }
      {
        type === 'files' && (
          <div className={mediaStyles.mediaCardFilePreviewContainer}>
            <p>{media.fileName.split('.').pop().toUpperCase()}</p>
          </div>
        )
      }
      {
        type === 'dirs' && (
          <div className={mediaStyles.mediaCardFilePreviewContainer}>
            <p><i className={`bx bx-lg bxs-folder`}/></p>
          </div>
        )
      }
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{media.fileName}</div>
        { canShowEditIcon && <i className="bx bxs-edit" /> }
      </div>
    </a>
  </div>
);

MediaCard.propTypes = {
  type: PropTypes.oneOf(['images', 'files', 'dirs']).isRequired,
  siteName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  media: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  canShowEditIcon: PropTypes.bool,
};

MediaCard.defaultProps = {
  siteName: '',
  isSelected: false,
  canShowEditIcon: false,
};

export default MediaCard;
