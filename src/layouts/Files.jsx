import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const FileCard = ({
  siteName, file,
}) => (
  <li>
    <Link to={`/sites/${siteName}/files/${file.fileName}`}>{file.fileName}</Link>
  </li>
);

export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      newPageName: null,
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

  updateNewPageName = (event) => {
    event.preventDefault();
    this.setState({ newPageName: event.target.value });
  }

  render() {
    const { files, newPageName } = this.state;
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
              <button
                type="button"
                className={elementStyles.blue}
              >
                Upload file
              </button>
            </div>
            <div className={contentStyles.contentContainerBars}>
              {/* File cards */}
              <ul>
                {files.length > 0
                  ? files.map((file) => (
                    <FileCard
                      siteName={siteName}
                      file={file}
                    />
                  ))
                  : ''}
              </ul>
              {/* End of file cards */}
            </div>
          </div>
          {/* main section ends here */}
        </div>
      </>
    );
  }
}
//         <input placeholder="New file name" onChange={this.updateNewPageName} />
//         <Link to={`/sites/${siteName}/documents/${newPageName}`}>Create new file</Link>
//       </div> */}

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
