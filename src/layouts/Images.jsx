import React, { Component, useEffect, useState } from 'react';
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

const Images = ({ match: { params: { siteName } }, location }) => {
  const [images, setImages] = useState([])
  const [pendingImageUpload, setPendingImageUpload] = useState(null)
  const [chosenImage, setChosenImage] = useState('')

  useEffect(() => {
    let _isMounted = true
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
          withCredentials: true,
        });
        const { images } = resp.data;
        if (_isMounted) setImages(images);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData()

    return () => {
      _isMounted = false
    }
  }, [])

  const uploadImage = async (imageName, imageContent) => {
    try {
      // toggle state so that image renaming modal appears
      setPendingImageUpload({
        pendingImageUpload: {
          fileName: imageName,
          path: `images%2F${imageName}`,
          content: imageContent,
        },
      })
    } catch (err) {
      console.log(err);
    }
  }

  const onImageSelect = async (event) => {
    const imgReader = new FileReader();
    const imgName = event.target.files[0].name;
    imgReader.onload = (() => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];

      uploadImage(imgName, imgData);
    });
    imgReader.readAsDataURL(event.target.files[0]);
  }

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
                  onChange={onImageSelect}
                  onClick={(event) => {
                    // eslint-disable-next-line no-param-reassign
                    event.target.value = '';
                  }}
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  hidden
                />
                {/* Images */}
                {images.length > 0 && images.map((image) => (
                  <MediaCard
                    type="image"
                    media={image}
                    siteName={siteName}
                    onClick={() => setChosenImage(image)}
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
          onClose={() => setChosenImage(null)}
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
          isPendingUpload
          onClose={() => setPendingImageUpload(null)}
          onSave={() => window.location.reload()}
        />
        )
      }
    </>
  );
}

export default Images

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
