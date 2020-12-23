import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import MediaUploadCard from '../components/media/MediaUploadCard';
import MediaCard from '../components/media/MediaCard';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

export default class Images extends Component {
  _isMounted = false

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenImage: null,
      pendingImageUpload: null,
    };
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      const { images } = resp.data;
      if (this._isMounted) this.setState({ images });
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
            {/* Info segment */}
            <div className={contentStyles.segment}>
              <i className="bx bx-sm bx-info-circle text-dark" />
              <span><strong className="ml-1">Note:</strong> Upload images here to link to them in pages and resources. The maximum image size allowed is 5MB.</span>
            </div>
            <div className={contentStyles.contentContainerBars}>
              <div className={contentStyles.boxesContainer}>
                <div className={mediaStyles.mediaCards}>
                  {/* Upload Image */}
                  <MediaUploadCard
                    type="image"
                    onClick={() => document.getElementById('file-upload').click()}
                  />
                  <input
                    onChange={this.onImageSelect}
                    onClick={(event) => {
                      // eslint-disable-next-line no-param-reassign
                      event.target.value = '';
                    }}
                    type="file"
                    id="file-upload"
                    accept="image/png, image/jpeg, image/gif"
                    hidden
                  />
                  {/* Images */}
                  {images.length > 0 && images.map((image) => (
                    <MediaCard
                      type="image"
                      media={image}
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
          <MediaSettingsModal
            type="image"
            media={chosenImage}
            siteName={siteName}
            isPendingUpload={false}
            onClose={() => this.setState({ chosenImage: null })}
            onSave={() => window.location.reload()}
          />
          )
        }
        {
          pendingImageUpload
          && (
          <MediaSettingsModal
            type="image"
            media={pendingImageUpload}
            siteName={siteName}
            // eslint-disable-next-line react/jsx-boolean-value
            isPendingUpload={true}
            onClose={() => this.setState({ pendingImageUpload: null })}
            onSave={() => window.location.reload()}
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
