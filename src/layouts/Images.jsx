import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import ImageSettingsModal from '../components/ImageSettingsModal';
import MediaUploadCard from '../components/media/UploadCard';
import MediaCard from '../components/media/Card';

const ImageCard = ({ image, siteName, onClick }) => MediaCard({
  type: 'image', siteName, onClick, media: image,
});

const ImageUploadCard = ({ onClick }) => MediaUploadCard({ onClick, type: 'image' });

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenImage: null,
      pendingImageUpload: null,
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
      // toggle state so that image renaming modal appears
      this.setState({
        pendingImageUpload: {
          fileName: imageName,
          path: `images%2F${imageName}`,
          content: imageContent,
        },
      });
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
    const { images, chosenImage, pendingImageUpload } = this.state;
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
                  <ImageUploadCard
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
            isPendingUpload={false}
            onClose={() => this.setState({ chosenImage: null })}
          />
          )
        }
        {
          pendingImageUpload
          && (
          <ImageSettingsModal
            image={pendingImageUpload}
            match={match}
            // eslint-disable-next-line react/jsx-boolean-value
            isPendingUpload={true}
            onClose={() => this.setState({ pendingImageUpload: null })}
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
