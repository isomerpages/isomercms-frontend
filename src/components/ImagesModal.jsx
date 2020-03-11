import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import MediaUploadCard from './media/MediaUploadCard';
import MediaCard from './media/MediaCard';
import LoadingButton from './LoadingButton';

export default class ImagesModal extends PureComponent {
  render() {
    const {
      siteName,
      images,
      onClose,
      onImageSelect,
      readImageToUpload,
      selectedImage,
      setSelectedImage,
    } = this.props;
    return (!!images.length
      && (
        <div className={elementStyles.overlay}>
          <div className={mediaStyles.mediaModal}>
            <div className={elementStyles.modalHeader}>
              <h1 style={{ flexGrow: 1 }}>Select Image</h1>
              <LoadingButton
                label="Select image"
                disabledStyle={elementStyles.disabled}
                className={elementStyles.blue}
                callback={onImageSelect}
              />
              <button type="button" onClick={onClose}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className={mediaStyles.mediaCards}>
              {/* Upload image */}
              <MediaUploadCard
                type="image"
                onClick={() => document.getElementById('file-upload').click()}
              />
              <input
                onChange={readImageToUpload}
                onClick={(event) => {
                  // eslint-disable-next-line no-param-reassign
                  event.target.value = '';
                }}
                type="file"
                id="file-upload"
                accept="image/png, image/jpeg, image/gif"
                hidden
              />
              {/* Render images */}
              {images.map((image) => (
                <MediaCard
                  type="image"
                  media={image}
                  siteName={siteName}
                  onClick={() => setSelectedImage(image.path)}
                  key={image.fileName}
                  isSelected={image.path === selectedImage}
                />
              ))}
            </div>
          </div>
        </div>
      )
    );
  }
}

ImagesModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  readImageToUpload: PropTypes.func.isRequired,
  selectedImage: PropTypes.string.isRequired,
  setSelectedImage: PropTypes.func.isRequired,
};
