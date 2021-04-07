import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import MediaUploadCard from '../components/media/MediaUploadCard';
import MediaCard from '../components/media/MediaCard';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

export default class Files extends Component {
  _isMounted = false

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      chosenFile: null,
      pendingFileUpload: null,
    };
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, {
        withCredentials: true,
      });
      const files = resp.data.documents;
      if (this._isMounted) this.setState({ files });
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onFileSelect = async (event) => {
    const fileReader = new FileReader();
    console.log(event.target.files)
    const file = event.target?.files[0] || '';
    if (file.name) {
      fileReader.onload = (() => {
        /** Github only requires the content of the file
         * fileReader returns  `data:application/*;base64, {fileContent}`
         * hence the split
         */

        const fileContent = fileReader.result.split(',')[1];
        // For modal to pop up
        this.setState({
          pendingFileUpload: {
            fileName: file.name,
            content: fileContent,
          },
        });
      });
      fileReader.readAsDataURL(file);
      event.target.value = '';
    }
  }

  uploadFile = async (fileName, fileContent) => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const params = {
        documentName: fileName,
        content: fileContent,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { files, chosenFile, pendingFileUpload } = this.state;
    const { match, location } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <Header 
          siteName={siteName}
        />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />
          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Files</h1>
            </div>
            {/* Info segment */}
            <div className={contentStyles.segment}>
              <i className="bx bx-sm bx-info-circle text-dark" />
              <span><strong className="ml-1">Note:</strong> Upload files here to link to them in pages and resources. The maximum file size allowed is 5MB.</span>
            </div>
            <div className={contentStyles.contentContainerBars}>
              {/* File cards */}
              <div className={mediaStyles.mediaCards}>
                <MediaUploadCard
                  type="file"
                  onClick={() => document.getElementById('file-upload').click()}
                />
                <input
                  onChange={this.onFileSelect}
                  type="file"
                  id="file-upload"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                  text/plain, application/pdf"
                  hidden
                />
                {files.length > 0
                  && files.map((file) => (
                    <MediaCard
                      type="file"
                      media={file}
                      siteName={siteName}
                      key={file.fileName}
                      onClick={() => this.setState({ chosenFile: file })}
                    />
                  ))}
              </div>
              {/* End of file cards */}
            </div>
          </div>
          {/* main section ends here */}
        </div>
        {
          // Modal to show when user selects an already uploaded file
          chosenFile
          && (
          <MediaSettingsModal
            type="file"
            media={chosenFile}
            isPendingUpload={false}
            siteName={siteName}
            onClose={() => this.setState({ chosenFile: null })}
            onSave={() => window.location.reload()}
          />
          )
        }
        {
          // Modal to show when user uploads a local file
          pendingFileUpload
          && (
          <MediaSettingsModal
            type="file"
            media={pendingFileUpload}
            isPendingUpload
            siteName={siteName}
            onClose={() => this.setState({ pendingFileUpload: null })}
            onSave={() => window.location.reload()}
          />
          )
        }
      </>
    );
  }
}

Files.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
