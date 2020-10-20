import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import MediaCard from './MediaCard';
import MediaUploadCard from './MediaUploadCard';
import LoadingButton from '../LoadingButton';

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

  render() {
    const {
      siteName,
      onClose,
      onMediaSelect,
      type,
      readFileToStageUpload,
    } = this.props;
    const { medias, selectedFile } = this.state;
    return (!!medias.length
      && (
        <>
          <div className={elementStyles.overlay}>
            <div className={mediaStyles.mediaModal}>
              <div className={elementStyles.modalHeader}>
                <h1 className="pl-5" style={{ flexGrow: 1 }}>Select File</h1>
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
                  onChange={readFileToStageUpload}
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
              {/* Flexbox parent needs to be full-width - https://stackoverflow.com/a/49029061 */}
              <div className="w-100">
                <div className={`d-flex ${elementStyles.modalFooter}`}>
                  <div className="ml-auto">
                    <LoadingButton
                        label={`Select ${type}`}
                        disabledStyle={elementStyles.disabled}
                        className={elementStyles.blue}
                        callback={() => {
                          if (selectedFile) onMediaSelect(`/${decodeURIComponent(selectedFile.path)}`)
                        }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
