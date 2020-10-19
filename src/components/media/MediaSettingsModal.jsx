import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import LoadingButton from '../LoadingButton';
import DeleteWarningModal from '../DeleteWarningModal';
import { validateFileName } from '../../utils/validators';

export default class MediaSettingsModal extends Component {
  constructor(props) {
    super(props);
    const { media: { fileName } } = props;
    this.state = {
      newFileName: fileName,
      sha: '',
      content: null,
      canShowDeleteWarningModal: false,
    };
  }

  async componentDidMount() {
    const {
      siteName, media, isPendingUpload, type,
    } = this.props;
    const { fileName } = media;

    if (isPendingUpload) {
      const { content } = media;
      this.setState({ content });
      return;
    }

    const { data: { sha, content } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'image' ? 'images' : 'documents'}/${fileName}`, {
      withCredentials: true,
    });
    this.setState({ sha, content });
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  saveFile = async () => {
    const {
      siteName,
      media: { fileName },
      isPendingUpload,
      type,
      onSave,
    } = this.props;
    const { newFileName, sha, content } = this.state;

    if (isPendingUpload) {
      const params = {
        content,
      };

      if (type === 'image') {
        params.imageName = newFileName;
      } else {
        params.documentName = newFileName;
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'image' ? 'images' : 'documents'}`, params, {
        withCredentials: true,
      });
    } else {
      const params = {
        sha,
        content,
      };

      // rename the image if the request comes from an already uploaded image
      if (newFileName === fileName) {
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'image' ? 'images' : 'documents'}/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    }

    onSave()
  }

  deleteFile = async () => {
    try {
      const { siteName, media: { fileName }, type } = this.props;
      const { sha } = this.state;
      const params = {
        sha,
      };

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'image' ? 'images' : 'documents'}/${fileName}`, {
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
      onClose, media, type, isPendingUpload, siteName,
    } = this.props;
    const {
      newFileName,
      sha,
      content,
      canShowDeleteWarningModal,
    } = this.state;
    const errorMessage = validateFileName(newFileName);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>
              Edit
              { ' ' }
              { type }
            </h1>
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          { type === 'image'
            ? (
              <div className={mediaStyles.editImagePreview}>
                <img
                  alt={`${media.fileName}`}
                  src={isPendingUpload ? `data:image/png;base64,${content}`
                    : (
                      `https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${media.path}${media.path.endsWith('.svg')
                        ? '?sanitize=true'
                        : ''}`
                    )}
                />
              </div>
            )
            : (
              <div className={mediaStyles.editFilePreview}>
                <p>{media.fileName.split('.').pop().toUpperCase()}</p>
              </div>
            )}
          <form className={elementStyles.modalContent}>
            <div className={elementStyles.modalFormFields}>
              <FormField
                title="File name"
                value={newFileName}
                errorMessage={errorMessage}
                id="file-name"
                isRequired
                onFieldChange={this.setFileName}
              />
            </div>
            <div className={elementStyles.modalButtons}>
              {isPendingUpload
                ? (
                  <LoadingButton
                    label="Save"
                    disabledStyle={elementStyles.disabled}
                    className={elementStyles.blue}
                    callback={this.saveFile}
                  />
                ) : (
                  <>
                    <LoadingButton
                      label="Save"
                      disabled={(errorMessage || !sha)}
                      disabledStyle={elementStyles.disabled}
                      className={(errorMessage || !sha) ? elementStyles.disabled : elementStyles.blue}
                      callback={this.saveFile}
                    />
                    <LoadingButton
                      label="Delete"
                      disabled={(errorMessage || !sha)}
                      disabledStyle={elementStyles.disabled}
                      className={(errorMessage || !sha) ? elementStyles.disabled : elementStyles.warning}
                      callback={() => this.setState({ canShowDeleteWarningModal: true })}
                    />
                  </>
                )}
            </div>
          </form>
        </div>
        {
          canShowDeleteWarningModal
          && (
            <DeleteWarningModal
              onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
              onDelete={this.deleteFile}
              type="image"
            />
          )
        }
      </div>
    );
  }
}

MediaSettingsModal.propTypes = {
  media: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['image', 'file']).isRequired,
  siteName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
};
