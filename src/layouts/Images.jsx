import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const ImageCard = ({
  siteName, image,
}) => (
  <li>
    <Link to={`/sites/${siteName}/images/${image.fileName}`}>{image.fileName}</Link>
  </li>
);

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      newImageName: '',
      settingsIsActive: false,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      const { images } = resp.data;
      this.setState({ images });
    } catch (err) {
      console.log(err);
    }
  }

  settingsToggle = (event) => {
    const { id } = event.target;
    const idArray = id.split('-');

    // Upload a new image
    this.setState((currState) => ({
      settingsIsActive: !currState.settingsIsActive,
    }));
  }

  updateNewPageName = (event) => {
    event.preventDefault();
  }

  uploadImage = async (imageName, imageContent) => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const params = {
        imageName,
        content: imageContent,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  onImageSelect = async (event) => {
    const imgReader = new FileReader();
    imgReader.imgName = event.target.files[0].name;
    imgReader.onload = () => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];

      const { imgName } = imgReader;

      this.setState({ newImageName: imgName, newImageContent: imgData });

      // TODO
      // this.uploadImage(imgName, imgData)
    };
    imgReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const { images, newImageName, newImageContent } = this.state;
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
              <h1 className={contentStyles.sectionTitle}>Images</h1>
              <button
                type="button"
                className={elementStyles.blue}
              >
                Upload new image
              </button>
            </div>
            <div className={contentStyles.contentContainerBars}>
              {/* Image cards */}
              <ul>
                {images.length > 0
                  ? images.map((image) => (
                    <ImageCard
                      siteName={siteName}
                      image={image}
                    />
                  ))
                  : 'There are no images in this repository'}
              </ul>
              {/* End of image cards */}
            </div>
          </div>
          {/* main section ends here */}
        </div>
      </>
    );
  }
}

Images.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

ImageCard.propTypes = {
  image: PropTypes.shape({
    fileName: PropTypes.string,
  }).isRequired,
  siteName: PropTypes.string.isRequired,
};
