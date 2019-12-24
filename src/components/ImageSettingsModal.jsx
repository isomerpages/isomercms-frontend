import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField';
import LoadingButton from './LoadingButton';
import { validateFileName } from '../utils/validators';


export default class ImageSettingsModal extends Component {
  constructor(props) {
    super(props);
    const { image: { fileName } } = props;
    this.state = {
      newFileName: fileName,
      sha: '',
      content: null,
    };
  }

  async componentDidMount() {
    const { match, image, isPendingUpload } = this.props;
    const { siteName } = match.params;
    if (isPendingUpload) {
      const { content } = image;
      this.setState({ content });
    } else {
      const { fileName } = image;
      const { data: { sha, content } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}`, {
        withCredentials: true,
      });
      this.setState({ sha, content });
    }
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  renameImage = async () => {
    const { match, image, isPendingUpload } = this.props;
    const { siteName } = match.params;
    const {
      newFileName,
      sha,
      content,
    } = this.state;

    // upload the image with the desired file name if the request comes from the upload image button
    if (isPendingUpload) {
      const params = {
        imageName: newFileName,
        content,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, params, {
        withCredentials: true,
      });
    // rename the image if the request comes from an already uploaded image
    } else {
      const params = {
        sha,
        content,
      };
      const { fileName } = image;
      if (newFileName === fileName) {
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    }
    // reload after action
    window.location.reload();
  }

  deleteImage = async () => {
    try {
      const { match, image: { fileName } } = this.props;
      const { siteName } = match.params;
      const { sha } = this.state;
      const params = {
        sha,
      };

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      match,
      onClose,
      image,
      isPendingUpload,
    } = this.props;
    const { siteName } = match.params;
    const { newFileName, sha, content } = this.state;
    const errorMessage = validateFileName(newFileName);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>Edit Image</h1>
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          <div className={mediaStyles.editMediaPreview}>
            <img
              alt={`${image.fileName}`}
              src={isPendingUpload ? `data:image/png;base64,${content}`
                : (
                  `https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}${image.path.endsWith('.svg')
                    ? '?sanitize=true'
                    : ''}`
                )}
            />
          </div>
          <form className={elementStyles.modalContent}>
            <div className={elementStyles.modalFormFields}>
              <FormField
                title="Image name"
                value={newFileName}
                errorMessage={errorMessage}
                id="file-name"
                isRequired
                onFieldChange={this.setFileName}
              />
            </div>
            <div className={elementStyles.modalButtons}>
              <LoadingButton
                label="Save"
                disabled={!!errorMessage}
                disabledStyle={elementStyles.disabled}
                className={(errorMessage || !sha) ? elementStyles.disabled : elementStyles.blue}
                callback={this.renameImage}
              />
              <LoadingButton
                label="Delete"
                disabled={!sha}
                disabledStyle={elementStyles.disabled}
                className={sha ? elementStyles.warning : elementStyles.disabled}
                callback={this.deleteImage}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ImageSettingsModal.propTypes = {
  image: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
