import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';
import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import MediaCard from './MediaCard';
import MediaUploadCard from './MediaUploadCard';
import { MediaSearchBar } from './MediaSearchBar';
import LoadingButton from '../LoadingButton';

export default class MediaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medias: '',
      filteredMedias: '',
      selectedFile: null,
    };
  }

  async componentDidMount() {
    const { siteName, type, imageSearchTerm } = this.props;
    const mediaRoute = type === 'file' ? 'documents' : 'images';
    try {
      const { data: { documents, images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${mediaRoute}`, {
        withCredentials: true,
      });
      if (_.isEmpty(documents || images)) {
        this.setState({ medias: [], filteredMedias: [], searchTerm: imageSearchTerm });
      } else {
        let filteredMedias
        if (type === 'file') {
          filteredMedias = this.filterMediaByFileName(documents, imageSearchTerm)
        } else {
          filteredMedias = this.filterMediaByFileName(images, imageSearchTerm)
        }

        this.setState({ medias: documents || images, filteredMedias, searchTerm: imageSearchTerm });
      }
    } catch (err) {
      console.error(err);
    }
  }

  filterMediaByFileName = (medias, filterTerm) => {
    const filteredMedias = medias.filter((media) => {
      if (media.fileName.toLowerCase().includes(filterTerm.toLowerCase())) return true
      return false
    })

    return filteredMedias
  }

  searchChangeHandler = (event) => {
    const { setImageSearchTerm } = this.props
    const { medias } = this.state
    const { target: { value } } = event
    const filteredMedias = this.filterMediaByFileName(medias, value)
    setImageSearchTerm(value)
    this.setState({ filteredMedias })
  }

  render() {
    const {
      siteName,
      onClose,
      onMediaSelect,
      type,
      readFileToStageUpload,
      imageSearchTerm,
    } = this.props;
    const { filteredMedias, selectedFile } = this.state;
    return (filteredMedias
      && (
        <>
          <div className={elementStyles.overlay}>
            <div className={mediaStyles.mediaModal}>
              <div className={elementStyles.modalHeader}>
                <h1 className="pl-5 mr-auto">{`Select ${type === 'file' ? 'File' : 'Image'}`}</h1>
                <MediaSearchBar value={imageSearchTerm} onSearchChange={this.searchChangeHandler} />
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
                {filteredMedias.map((media) => (
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

MediaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['file', 'image']).isRequired,
  setImageSearchTerm: PropTypes.func.isRequired,
};
