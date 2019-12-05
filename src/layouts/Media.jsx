import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Bluebird from 'bluebird';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import ImagesModal from '../components/ImagesModal';
import EditImageModal from '../components/EditImageModal';

// Counts the number of objects in an array
// If the submitted object is an object, then the length of the list is 0
const objectCounter = (item) => (
  item.length ? item.length : 0
);

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numImages: '',
      numFiles: '',
      canShowImagesModal: false,
      chosenImage: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;

      await Bluebird.all(
        ['images', 'documents'].map(
          (endpoint) => (
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${endpoint}`, {
              withCredentials: true,
            })
          ),
        ),
      ).spread((imageResp, documentResp) => {
        this.setState({
          numImages: objectCounter(imageResp.data.images),
          numFiles: objectCounter(documentResp.data.documents),
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  showImagesModal = () => {
    this.setState({ canShowImagesModal: true });
  }

  hideImagesModal = () => {
    this.setState({ canShowImagesModal: false });
  }

  render() {
    const {
      numImages, numFiles, canShowImagesModal, chosenImage,
    } = this.state;
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
              <h1 className={contentStyles.sectionTitle}>Media</h1>
            </div>
            <div className={contentStyles.contentContainerBars}>
              <ul>
                <li>
                  <button type="button" onClick={this.showImagesModal}>Images</button>
                </li>
                <li>
                  <Link to={`/sites/${siteName}/files`}>Files</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {
          canShowImagesModal
          && (
          <ImagesModal
            match={match}
            onClose={this.hideImagesModal}
            onImageSelect={(image) => this.setState({ chosenImage: image, canShowImagesModal: false })}
          />
          )
        }
        {
          chosenImage
          && (
            <EditImageModal
              image={chosenImage}
              onClose={() => this.setState({ chosenImage: null })}
              match={match}
            />
          )
        }
      </>
    );
  }
}

Media.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
