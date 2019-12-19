import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import FileSettingsModal from '../components/FileSettingsModal';

// const FileCard = ({
//   siteName, file,
// }) => (
//   <li>
//     <Link to={`/sites/${siteName}/files/${file.fileName}`}>{file.fileName}</Link>
//   </li>
// );
const FileCard = ({ file, onClick }) => (
  <div className={mediaStyles.mediaCard} key={file.path}>
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(); }}>
      <div className={mediaStyles.mediaCardFileContainer}>
        <p>{file.fileName.split('.').pop().toUpperCase()}</p>
      </div>
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{file.fileName}</div>
        <i className="bx bxs-edit" />
      </div>
    </a>
  </div>
);

const UploadFileCard = ({ onClick }) => (
  <button
    type="button"
    id="settings-NEW"
    onClick={onClick}
    className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew} ${mediaStyles.mediaCardDimensions}`}
  >
    <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
    <h2 id="settingsText-NEW">Upload file</h2>
  </button>
);

UploadFileCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      chosenFile: null,
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

  // TODO - a modal which allows for the creation/upload of a new file
  // and this.newPageName is updated onChange
  updateNewPageName = (event) => {
    event.preventDefault();
    this.setState({ newPageName: event.target.value });
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
      console.log(fileReader.result);

      this.uploadFile(fileName, fileContent);
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
    const { files, chosenFile } = this.state;
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
                <UploadFileCard
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
          chosenFile
          && (
          <FileSettingsModal
            file={chosenFile}
            siteName={siteName}
            onClose={() => this.setState({ chosenFile: null })}
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
  }).isRequired,
  siteName: PropTypes.string.isRequired,
};
