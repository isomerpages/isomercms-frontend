import React, { Component } from 'react';
import axios from 'axios';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import PropTypes from 'prop-types';

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
        <i className="bx bxs-edit" />
      </div>
    </a>
  </div>
);


export default class ImagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenImage: null,
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

  onImageCardClick = (image) => {
    this.setState({ chosenImage: image });
  }

  render() {
    const { match, onClose, onImageSelect } = this.props;
    const { siteName } = match.params;
    const { images } = this.state;
    return (images.length
      && (
        <div className={elementStyles.overlay}>
          <div className={mediaStyles.mediaContainer}>
            <div className={mediaStyles.sectionHeader}>
              <div className={mediaStyles.sectionTitle}>
                <b>Manage Images</b>
              </div>
            </div>
            <div className={mediaStyles.mediaCards}>
              {images.map((image) => (
                <ImageCard
                  image={image}
                  siteName={siteName}
                  onClick={onImageSelect}
                />
              ))}
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="button" className={elementStyles.blue} onClick={onClose}>Close</button>
            </div>
          </div>
        </div>

      )
    );
  }
}
