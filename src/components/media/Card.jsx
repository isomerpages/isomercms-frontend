import React from 'react';
import PropTypes from 'prop-types';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';

const MediaCard = ({
  type, siteName, onClick, media,
}) => (
  <div className={mediaStyles.mediaCard} key={media.path}>
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(); }}>
      {
        type === 'image' && (
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
        type === 'file' && (
          <div className={mediaStyles.mediaCardFilePreviewContainer}>
            <p>{media.fileName.split('.').pop().toUpperCase()}</p>
          </div>
        )
      }
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{media.fileName}</div>
        <i className="bx bxs-edit" />
      </div>
    </a>
  </div>
);

MediaCard.propTypes = {
  type: PropTypes.oneOf(['image', 'file']).isRequired,
  siteName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  media: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
};

MediaCard.defaultProps = {
  siteName: '',
};

export default MediaCard;
