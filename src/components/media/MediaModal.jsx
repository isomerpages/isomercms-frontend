import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import MediaCard from './MediaCard';
import MediaUploadCard from './MediaUploadCard';
import LoadingButton from '../LoadingButton';
import MediaSettingsModal from './MediaSettingsModal';

export default class MediasModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medias: [],
      selectedFile: null,
    };
  }

  async componentDidMount() {
    const { siteName, type } = this.props;
    const mediaRoute = type === 'file' ? 'documents' : 'images';
    try {
      const { data: { documents, images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${mediaRoute}`, {
        withCredentials: true,
      });
      this.setState({ medias: documents || images });
    } catch (err) {
      console.error(err);
    }
  }

  stageFileForUpload = (fileName, fileData) => {
    const { type } = this.props;
    const baseFolder = type === 'file' ? 'files' : 'images';
    this.setState({
      stagedFileForUpload: {
        path: `${baseFolder}%2F${fileName}`,
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
      onMediaSelect,
      type,
    } = this.props;
    const { medias, selectedFile, stagedFileForUpload } = this.state;
    return (!!medias.length
      && (
        <>
          <div className={elementStyles.overlay}>
            <div className={mediaStyles.mediaModal}>
              <div className={elementStyles.modalHeader}>
                <h1 style={{ flexGrow: 1 }}>Select File</h1>
                <LoadingButton
                  label={`Select ${type}`}
                  disabledStyle={elementStyles.disabled}
                  className={elementStyles.blue}
                  callback={() => onMediaSelect(`/${decodeURIComponent(selectedFile.path)}`)}
                />
                <button type="button" onClick={onClose}>
                  <i className="bx bx-x" />
                </button>
              </div>
              <div className={mediaStyles.mediaCards}>
                {/* Upload image */}
                <MediaUploadCard
                  type={type}
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
                  accept={type === 'file' ? `application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                  text/plain, application/pdf` : 'image*'}
                  hidden
                />
                {/* Render medias */}
                {medias.map((media) => (
                  <MediaCard
                    type={type}
                    media={media}
                    siteName={siteName}
                    onClick={() => this.setState({ selectedFile: media })}
                    key={media.path}
                    isSelected={media.path === selectedFile?.path}
                  />
                ))}
              </div>
            </div>
          </div>
          {
            stagedFileForUpload && (
              <MediaSettingsModal
                type={type}
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

MediasModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['file', 'image']).isRequired,
};
