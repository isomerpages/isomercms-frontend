import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import MediaCard from './media/MediaCard';
import MediaUploadCard from './media/MediaUploadCard';
import LoadingButton from './LoadingButton';

export default class FilesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      selectedFile: null,
    };
  }

  async componentDidMount() {
    const { siteName } = this.props;
    try {
      const { data: { documents } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, {
        withCredentials: true,
      });
      this.setState({ files: documents });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const {
      siteName,
      onClose,
      onFileSelect,
      readImageToUpload,
    } = this.props;
    const { files, selectedFile } = this.state;
    return (!!files.length
      && (
        <div className={elementStyles.overlay}>
          <div className={mediaStyles.mediaModal}>
            <div className={elementStyles.modalHeader}>
              <h1 style={{ flexGrow: 1 }}>Select File</h1>
              <LoadingButton
                label="Select file"
                disabledStyle={elementStyles.disabled}
                className={elementStyles.blue}
                callback={() => onFileSelect(`/${decodeURIComponent(selectedFile.path)}`)}
              />
              <button type="button" onClick={onClose}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className={mediaStyles.mediaCards}>
              {/* Upload image */}
              <MediaUploadCard
                type="file"
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
              {/* Render files */}
              {files.map((file) => (
                <MediaCard
                  type="file"
                  media={file}
                  siteName={siteName}
                  onClick={() => this.setState({ selectedFile: file })}
                  key={file.path}
                  isSelected={file.path === selectedFile?.path}
                />
              ))}
            </div>
          </div>
        </div>
      )
    );
  }
}

FilesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  readImageToUpload: PropTypes.func.isRequired,
};
