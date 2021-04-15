import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import FormField from '../FormField';
import DeleteWarningModal from '../DeleteWarningModal';
import SaveDeleteButtons from '../SaveDeleteButtons';

import { validateFileName } from '../../utils/validators';
import {
  DEFAULT_RETRY_MSG,
} from '../../utils'
import { errorToast } from '../../utils/toasts';

import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';

const generateImageorFilePath = (customPath, fileName) => {
  if (customPath) return encodeURIComponent(`${customPath}/${fileName}`)
  return fileName
}

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
      siteName, customPath, media, isPendingUpload, type,
    } = this.props;
    const { fileName } = media;

    if (isPendingUpload) {
      const { content } = media;
      this.setState({ content });
      return;
    }

    let sha, content
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'image' ? 'images' : 'documents'}/${generateImageorFilePath(customPath, fileName)}`, {
        withCredentials: true,
      });
      sha = data.sha
      content = data.content
    } catch (err) {
      errorToast(`We were unable to retrieve data on your image file. ${DEFAULT_RETRY_MSG}`)
    }
    this.setState({ sha, content });
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  saveFile = async () => {
    const {
      siteName,
      customPath,
      media: { fileName },
      isPendingUpload,
      type,
      onSave,
    } = this.props;
    const { newFileName, sha, content } = this.state;

    try {
      if (isPendingUpload) {
        const params = {
          content,
        };

        if (type === 'image') {
          params.imageName = newFileName;
          params.imageDirectory = `images${customPath ? `/${customPath}` : ''}`;
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
      onSave(newFileName)
    } catch (err) {
      if (err?.response?.status === 409) {
        // Error due to conflict in name
        errorToast(`Another ${type === 'image' ? 'image' : 'file'} with the same name exists. Please choose a different name.`)
      } else if (err?.response?.status === 413 || err?.response === undefined) {
        // Error due to file size too large - we receive 413 if nginx accepts the payload but it is blocked by our express settings, and undefined if it is blocked by nginx
        errorToast(`Unable to upload as the ${type === 'image' ? 'image' : 'file'} size exceeds 5MB. Please reduce your ${type === 'image' ? 'image' : 'file'} size and try again.`)
      } else {
        errorToast(`There was a problem trying to save this ${type === 'image' ? 'image' : 'file'}. ${DEFAULT_RETRY_MSG}`)
      }
      console.log(err);
    }
  }

  deleteFile = async () => {
    const { siteName, media: { fileName }, type } = this.props;
    try {
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
      errorToast(`There was a problem trying to delete this ${type === 'image' ? 'image' : 'file'}. ${DEFAULT_RETRY_MSG}`)
      console.log(err);
    }
  }

  render() {
    const {
      onClose, media, type, isPendingUpload, siteName,
    } = this.props;
    const { fileName } = media
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
              {isPendingUpload ? `Upload new ${type}` : `Edit ${type} details`}
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
            <SaveDeleteButtons
              saveLabel={isPendingUpload ? "Upload" : "Save"}
              isDisabled={isPendingUpload ? false : !sha}
              isSaveDisabled={isPendingUpload ? false : (fileName === this.state.newFileName || errorMessage || !sha)}
              hasDeleteButton={!isPendingUpload}
              saveCallback={this.saveFile}
              deleteCallback={() => this.setState({ canShowDeleteWarningModal: true })}
              isLoading={isPendingUpload ? false : !sha}
            />
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
  onSave: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
};
