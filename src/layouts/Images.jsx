import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import ImageSettingsModal from '../components/ImageSettingsModal';

const ImageCard = ({ image, siteName, onClick }) => (
  <div className={mediaStyles.mediaCard} key={image.path}>
    <a href="/" onClick={(e) => { e.preventDefault(); onClick(); }}>
      <div className={mediaStyles.mediaCardImageContainer}>
        <img
          className={mediaStyles.mediaCardImage}
          alt={`${image.fileName}`}
          // The sanitise parameter is for SVGs. It converts the raw svg data into an image
          src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}${image.path.endsWith('.svg') ? '?sanitize=true' : ''}`}
        />
      </div>
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{image.fileName}</div>
        <i className="bx bxs-edit" />
      </div>
    </a>
  </div>
);

const UploadImageCard = ({ onClick }) => (
  <button
    type="button"
    id="settings-NEW"
    onClick={onClick}
    className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew} ${mediaStyles.mediaCardDimensions}`}
  >
    <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
    <h2 id="settingsText-NEW">Upload new image</h2>
  </button>
);

UploadImageCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenImage: null,
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
    const imgName = event.target.files[0].name;
    imgReader.onload = (() => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];

      this.uploadImage(imgName, imgData);
    });
    imgReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const { images, chosenImage } = this.state;
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
            </div>
            <div className={contentStyles.contentContainerBars}>
              <div className={contentStyles.boxesContainer}>
                <div className={mediaStyles.mediaCards}>
                  {/* Upload Image */}
                  <UploadImageCard
                    onClick={() => document.getElementById('file-upload').click()}
                  />
                  <input
                    onChange={this.onImageSelect}
                    type="file"
                    id="file-upload"
                    accept="image/png, image/jpeg, image/gif"
                    hidden
                  />
                  {/* Images */}
                  {images.map((image) => (
                    <ImageCard
                      image={image}
                      siteName={siteName}
                      onClick={() => this.setState({ chosenImage: image })}
                      key={image.fileName}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* End of image cards */}
          </div>
          {/* main section ends here */}
        </div>
        {
          chosenImage
          && (
          <ImageSettingsModal
            image={chosenImage}
            match={match}
            onClose={() => this.setState({ chosenImage: null })}
          />
          )
        }
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
    path: PropTypes.string,
  }).isRequired,
  siteName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
