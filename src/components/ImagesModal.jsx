import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const ImageCard = ({ onClick, image, siteName }) => (
  <div className={mediaStyles.mediaCard} key={image.path}>
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(image); }}>
      <div className={mediaStyles.mediaCardImageContainer}>
        <img
          className={mediaStyles.mediaCardImage}
          alt={`${image.fileName}`}
          src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}${image.path.endsWith('.svg') ? '?sanitize=true' : ''}`}
        />
      </div>
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{image.fileName}</div>
      </div>
    </a>
  </div>
);

ImageCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  image: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  siteName: PropTypes.string.isRequired,
};

export default class ImagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { siteName } = match.params;
    try {
      const { data: { images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      this.setState({ images });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { match, onClose, onImageSelect } = this.props;
    const { siteName } = match.params;
    const { images } = this.state;
    return (images.length
      && (
        <div className={elementStyles.overlay}>
          <div className={mediaStyles.mediaModal}>
            <div className={elementStyles.modalHeader}>
              <h1>Select Image</h1>
              <button type="button" onClick={onClose}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className={mediaStyles.mediaCards}>
              {images.map((image) => (
                <ImageCard
                  image={image}
                  siteName={siteName}
                  onClick={onImageSelect}
                  key={image.fileName}
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
  onClose: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onImageSelect: PropTypes.func.isRequired,
};
