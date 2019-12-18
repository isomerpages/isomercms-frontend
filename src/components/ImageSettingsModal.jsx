import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField';
import { validateFileName } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';


export default class ImageSettingsModal extends Component {
  constructor(props) {
    super(props);
    const { image: { fileName } } = props;
    this.state = {
      newFileName: fileName,
      sha: '',
      content: null,
      canShowDeleteWarningModal: false,
    };
  }

  async componentDidMount() {
    const { match, image: { fileName } } = this.props;
    const { siteName } = match.params;
    const { data: { sha, content } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}`, {
      withCredentials: true,
    });
    this.setState({ sha, content });
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  renameImage = async () => {
    const { match, image: { fileName } } = this.props;
    const { siteName } = match.params;
    const { newFileName, sha, content } = this.state;
    const params = {
      sha,
      content,
    };

    if (newFileName === fileName) {
      return;
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}/rename/${newFileName}`, params, {
      withCredentials: true,
    });

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
    const { match, onClose, image } = this.props;
    const { siteName } = match.params;
    const { newFileName, sha, canShowDeleteWarningModal } = this.state;
    const errorMessage = validateFileName(newFileName);

    return (
      <>
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
                src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}${image.path.endsWith('.svg') ? '?sanitize=true' : ''}`}
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
                <button type="button" className={errorMessage ? elementStyles.disabled : elementStyles.blue} disabled={!!errorMessage} onClick={this.renameImage}>Save</button>
                <button type="button" className={sha ? elementStyles.warning : elementStyles.disabled} onClick={() => this.setState({ canShowDeleteWarningModal: true })} disabled={!sha}>Delete</button>
              </div>
            </form>
          </div>
          {
          canShowDeleteWarningModal
          && (
            <DeleteWarningModal
              onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
              onDelete={this.deleteImage}
              type="image"
            />
          )
          }
        </div>
      </>
    );
  }
}

ImageSettingsModal.propTypes = {
  image: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
