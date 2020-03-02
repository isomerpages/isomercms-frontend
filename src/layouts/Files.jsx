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

const FileCard = ({ file, onClick }) => MediaCard({ type: 'file', onClick, media: file });

const FileUploadCard = ({ onClick }) => MediaUploadCard({ onClick, type: 'file' });

export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      chosenFile: null,
      pendingFileUpload: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/documents`, {
        withCredentials: true,
      });
      const files = resp.data.documents;
      this.setState({ files });
    } catch (err) {
      console.log(err);
    }
  }

  onFileSelect = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the file
       * fileReader returns  `data:application/*;base64, {fileContent}`
       * hence the split
       */

      const fileContent = fileReader.result.split(',')[1];
      // For modal to pop up
      this.setState({
        pendingFileUpload: {
          fileName,
          content: fileContent,
        },
      });
    });
    fileReader.readAsDataURL(event.target.files[0]);
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
        <Header />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />
          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Files</h1>
            </div>
            <div className={contentStyles.contentContainerBars}>
              {/* File cards */}
              <div className={mediaStyles.mediaCards}>
                <FileUploadCard
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
                    <FileCard
                      siteName={siteName}
                      file={file}
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

FileCard.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
