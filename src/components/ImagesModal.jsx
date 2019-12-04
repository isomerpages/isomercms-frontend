import React, { Component } from 'react';
import axios from 'axios';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const ImageCard = ({ click, image, siteName }) => (
  <div className={mediaStyles.siteContainer} key={image.path}>
    <div className={mediaStyles.site}>
      <a href="/" onClick={(e) => { e.preventDefault(); click(image); }}>
        <div className={mediaStyles.siteImageContainer}>
          <img
            className={mediaStyles.siteImage}
            alt={`${image.fileName}`}
            src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}`}
          />
        </div>
        <div className={mediaStyles.siteDescription}>
          <div className={mediaStyles.siteName}>{image.fileName}</div>
          <i className="bx bxs-edit" />
        </div>
      </a>
    </div>
  </div>
);

export default class ImagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenImage: null,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { siteName } = match.params;
    try {
      const { data: { images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      this.setState({ images });
    } catch (e) {
      console.log(e);
    }
  }

  onImageCardClick = (image) => {
    this.setState({ chosenImage: image });
  }

  render() {
    const { match, toggleImages } = this.props;
    const { siteName } = match.params;
    const { images } = this.state;
    console.log(images);
    return (images.length
      && (
        <div className={elementStyles.overlay}>
          <div className={mediaStyles.sitesContainer}>
            <div className={mediaStyles.sectionHeader}>
              <div className={mediaStyles.sectionTitle}>
                <b>Manage Images</b>
              </div>
            </div>
            <div className={mediaStyles.sites}>
              {images.map((image) => (
                <ImageCard
                  image={image}
                  siteName={siteName}
                  click={this.onImageCardClick}
                />
              ))}
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="button" className={elementStyles.blue} onClick={toggleImages}>Close</button>
            </div>
          </div>
        </div>

      )
    );
  }
}
