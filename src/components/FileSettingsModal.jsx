import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField';
import { validateFileName } from '../utils/validators';


export default class FileSettingsModal extends Component {
  constructor(props) {
    super(props);
    const { file: { fileName } } = props;
    this.state = {
      newFileName: fileName,
      sha: '',
      content: null,
    };
  }

  async componentDidMount() {
    const { siteName, file, isPendingUpload } = this.props;
    const { fileName } = file;
    if (isPendingUpload) {
      const { content } = file;
      this.setState({ content });
    }
    const { data: { sha, content } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}`, {
      withCredentials: true,
    });
    this.setState({ sha, content });
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  saveFile = async () => {
    const { siteName, file: { fileName }, isPendingUpload } = this.props;
    const { newFileName, sha, content } = this.state;

    if (isPendingUpload) {
      const params = {
        documentName: newFileName,
        content,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, params, {
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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}/rename/${newFileName}`, params, {
        withCredentials: true,
      });
    }

    window.location.reload();
  }

  deleteFile = async () => {
    try {
      const { siteName, file: { fileName } } = this.props;
      const { sha } = this.state;
      const params = {
        sha,
      };

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { onClose, file } = this.props;
    const { newFileName, sha } = this.state;
    const errorMessage = validateFileName(newFileName);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>Edit file</h1>
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          <form className={elementStyles.modalContent}>
            <div className={mediaStyles.editFilePreview}>
              <p>{file.fileName.split('.').pop().toUpperCase()}</p>
            </div>
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
              <button type="button" className={errorMessage ? elementStyles.disabled : elementStyles.blue} disabled={!!errorMessage} onClick={this.saveFile}>Save</button>
              <button type="button" className={sha ? elementStyles.warning : elementStyles.disabled} onClick={this.deleteFile} disabled={!sha}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

FileSettingsModal.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  siteName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
};
