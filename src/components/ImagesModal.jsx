import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { ImageCard, UploadImageCard } from './layouts/Image.jsx';

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

  uploadImage = async (imageName, imageContent) => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const params = {
        imageName,
        content: imageContent,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, params, {
        withCredentials: true,
      });

      window.location.reload();
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

ImagesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onImageSelect: PropTypes.func.isRequired,
};
