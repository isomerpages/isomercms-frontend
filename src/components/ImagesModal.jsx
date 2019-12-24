import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { UploadImageCard } from '../layouts/Images';

export const ImageCard = ({ image, siteName, onClick }) => (
  <div className={mediaStyles.mediaCard} key={image.path}>
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(image.path); }}>
      <div className={mediaStyles.mediaCardImageContainer}>
        <img
          className={mediaStyles.mediaCardImage}
          alt={`${image.fileName}`}
          // The sanitise parameter is for SVGs. It converts the raw svg data into an image
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
    };
  }

  async componentDidMount() {
    const { siteName } = this.props;
    try {
      this.getImage(siteName);
    } catch (e) {
      console.log(e);
    }
  }

  getImage = async (siteName) => {
    const { data: { images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
      withCredentials: true,
    });
    this.setState({ images });
  }

  uploadImage = async (imageName, imageContent) => {
    try {
      const { siteName } = this.props;
      const params = {
        imageName,
        content: imageContent,
      };

      // add a loading screen while file is being uploaded
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, params, {
        withCredentials: true,
      });

      // trigger a re-render of the modal
      const { data: { images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      this.setState({ images });
    } catch (err) {
      console.log(err);
    }
  }

  onImageSelect = async (event) => {
    const imgReader = new FileReader();
    const imgName = event.target.files[0].name;
    imgReader.onload = (() => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];

      this.uploadImage(imgName, imgData);
    });
    imgReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const { siteName, onClose, onImageSelect } = this.props;
    const { images } = this.state;
    return (!!images.length
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
              {/* Upload image */}
              <UploadImageCard
                onClick={() => document.getElementById('file-upload').click()}
              />
              <input
                onChange={this.onImageSelect}
                type="file"
                id="file-upload"
                accept="image/png, image/jpeg, image/gif"
                hidden
              />
              {/* Render images */}
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

ImageCard.propTypes = {
  image: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  siteName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

ImagesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onImageSelect: PropTypes.func.isRequired,
};
