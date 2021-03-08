import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FolderCard from '../components/FolderCard'
import MediaUploadCard from '../components/media/MediaUploadCard';
import MediaCard from '../components/media/MediaCard';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

import { getImages } from '../api';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';

import { deslugifyDirectory } from '../utils';

// Constants
const IMAGE_CONTENTS_KEY = 'image-contents'

const getPrevDirectoryPath = (customPath) => {
  const customPathArr = customPath.split('/')

  let prevDirectoryPath
  if (customPathArr.length > 1) {
    prevDirectoryPath = customPathArr
      .slice(0, -1) // remove the latest directory
      .join('/')
      .slice(1) // remove starting `/`
  }
  else {
    prevDirectoryPath = 'images'
  }

  return prevDirectoryPath
}

const getPrevDirectoryName = (customPath) => {
  const customPathArr = customPath.split('/')

  let prevDirectoryName
  if (customPathArr.length > 1) {
    prevDirectoryName = customPathArr[customPathArr.length - 2]
  }
  else {
    prevDirectoryName = 'Images'
  }

  return deslugifyDirectory(prevDirectoryName)
}

const Images = ({ match: { params: { siteName, customPath } }, location }) => {
  const [images, setImages] = useState([])
  const [directories, setDirectories] = useState([])
  const [pendingImageUpload, setPendingImageUpload] = useState(null)
  const [chosenImage, setChosenImage] = useState('')

  const { data: imageData, refetch } = useQuery(
    IMAGE_CONTENTS_KEY,
    () => getImages(siteName, customPath ? decodeURIComponent(customPath): ''),
    {
      retry: false,
      // TO-DO: error-handling
    },
  )

  useEffect(() => {
    let _isMounted = true

    if (imageData) {
      const {
        respImages,
        respDirectories,
      } = imageData

      if (_isMounted) {
        setImages(respImages)
        setDirectories(respDirectories)
      }
    }

    return () => {
      _isMounted = false
    }
  }, [imageData])

  useEffect(() => {
    refetch()
  }, [customPath])

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
      <Header
        backButtonText={`Back to ${customPath ? getPrevDirectoryName(customPath) : 'Sites'}`}
        backButtonUrl={customPath ? `/sites/${siteName}/${getPrevDirectoryPath(customPath)}` : '/sites'}
      />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>Images</h1>
          </div>
          {/* Directories segment */}
          <div className={contentStyles.segment}>
            Folders
          </div>
          {/* Image folders */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {
                directories && directories.length > 0
                ? directories.map((directory, idx) => (
                    <FolderCard
                      displayText={deslugifyDirectory(directory.name)}
                      settingsToggle={() => {}}
                      key={directory.name}
                      pageType={"media"}
                      linkPath={`images/${encodeURIComponent(directory.path
                          .split('/')
                          .slice(1) // remove `images` prefix
                          .join('/')
                        )}`
                      }
                      siteName={siteName}
                      itemIndex={idx}
                    />
                ))
                : (
                  <div className={contentStyles.segment}>
                    There are no image sub-directories in this directory.
                  </div>
                )
              }
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
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
      {
          process.env.REACT_APP_ENV === 'LOCAL_DEV' && <ReactQueryDevtools initialIsOpen={false} />
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
