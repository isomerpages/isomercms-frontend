import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import MediaCard from './media/MediaCard';
import MediaUploadCard from './media/MediaUploadCard';
import LoadingButton from './LoadingButton';
import MediaSettingsModal from './media/MediaSettingsModal';

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

  stageFileForUpload = (fileName, fileData) => {
    this.setState({
      stagedFileForUpload: {
        path: `files%2F${fileName}`,
        content: fileData,
        fileName,
      },
    });
  }

  readFileToStageUpload = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the image
         * imgReader returns  `data:application/pdf;base64, {fileContent}`
         * hence the split
         */

      const fileData = fileReader.result.split(',')[1];
      this.stageFileForUpload(fileName, fileData);
    });
    fileReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const {
      siteName,
      onClose,
      onFileSelect,
    } = this.props;
    const { files, selectedFile, stagedFileForUpload } = this.state;
    return (!!files.length
      && (
        <>
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
                  onChange={this.readFileToStageUpload}
                  onClick={(event) => {
                    // eslint-disable-next-line no-param-reassign
                    event.target.value = '';
                  }}
                  type="file"
                  id="file-upload"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                  text/plain, application/pdf"
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
          {
            stagedFileForUpload && (
              <MediaSettingsModal
                type="file"
                siteName={siteName}
                onClose={() => this.setState({ selectedFile: null })}
                media={stagedFileForUpload}
                isPendingUpload
              />
            )
          }
        </>
      )
    );
  }
}

FilesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onFileSelect: PropTypes.func.isRequired,
};
