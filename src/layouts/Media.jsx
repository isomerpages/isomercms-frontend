import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FolderCard from '../components/FolderCard'
import FolderOptionButton from '../components/folders/FolderOptionButton'
import FolderNamingModal from '../components/FolderNamingModal'
import MediaCard from '../components/media/MediaCard';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

import { createMediaSubfolder, getMedia } from '../api';
import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY } from '../constants'

import useRedirectHook from '../hooks/useRedirectHook';

import { DEFAULT_RETRY_MSG, deslugifyDirectory, slugifyCategory } from '../utils';
import { validateCategoryName } from '../utils/validators'
import { errorToast, successToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';

const mediaNames = {
  images: 'images',
  documents: 'files',
}

const getPrevDirectoryPath = (customPath, mediaType) => {
  const customPathArr = customPath.split('%2F')

  let prevDirectoryPath
  if (customPathArr.length > 1) {
    prevDirectoryPath = `${mediaType}/${customPathArr
      .slice(0, -1) // remove the latest directory
      .join('/')}`
  }
  else {
    prevDirectoryPath = mediaType
  }

  return prevDirectoryPath
}

const getPrevDirectoryName = (customPath, mediaType) => {
  const customPathArr = customPath.split('%2F')

  let prevDirectoryName
  if (customPathArr.length > 1) {
    prevDirectoryName = customPathArr[customPathArr.length - 2]
  }
  else {
    prevDirectoryName = (mediaType === 'images' ? `Images` : 'Files')
  }

  return deslugifyDirectory(prevDirectoryName)
}

const Media = ({ match: { params: { siteName, customPath } }, location, mediaType }) => {
  const [media, setMedia] = useState([])
  const [directories, setDirectories] = useState([])
  const [directoryNames, setDirectoryNames] = useState([])
  const [pendingMediaUpload, setPendingMediaUpload] = useState(null)
  const [chosenMedia, setChosenMedia] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [errors, setErrors] = useState('')
  const [isCreateModalActive, setIsCreateModalActive] = useState(false)
  const { setRedirectToNotFound } = useRedirectHook()

  const { data: mediaData, refetch } = useQuery(
    mediaType === 'images' ? IMAGE_CONTENTS_KEY : DOCUMENT_CONTENTS_KEY,
    () => getMedia(siteName, customPath ? decodeURIComponent(customPath): '', mediaNames[mediaType]),
    {
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast()
        }
      }
    },
  )

  // create folder
  const { mutateAsync: createHandler } = useMutation(
    () => createMediaSubfolder(siteName, mediaType, `${customPath ? `${customPath}/` : ''}${slugifyCategory(newFolderName)}`),
    {
      onError: () => errorToast(`Your subfolder could not be created successfully. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => {
        refetch()
        successToast(`Successfully created new subfolder!`)
      },
      onSettled: () => {
        setIsCreateModalActive((prevState) => !prevState)
      },
    }
  )
  

  useEffect(() => {
    let _isMounted = true

    if (mediaData) {
      const {
        respMedia,
        respDirectories,
      } = mediaData

      const filteredMedia = []
      respMedia.forEach((media) => { if (media.fileName !== `.keep`) filteredMedia.push(media) })

      if (_isMounted) {
        setMedia(filteredMedia)
        setDirectories(respDirectories)
        setDirectoryNames(respDirectories.map(directory => directory.name))
      }
    }

    return () => {
      _isMounted = false
    }
  }, [mediaData])

  useEffect(() => {
    refetch()
  }, [customPath])

  const uploadMedia = async (mediaName, mediaContent) => {
    try {
      // toggle state so that media renaming modal appears
      setPendingMediaUpload({
        fileName: mediaName,
        path: `${mediaType}%2F${mediaName}`,
        content: mediaContent,
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

      uploadMedia(imgName, imgData);
    });
    imgReader.readAsDataURL(event.target.files[0]);
  }

  const onFileSelect = async (event) => {
    const fileReader = new FileReader();
    const file = event.target?.files[0] || '';
    if (file.name) {
      fileReader.onload = (() => {
        /** Github only requires the content of the file
         * fileReader returns  `data:application/*;base64, {fileContent}`
         * hence the split
         */

        const fileContent = fileReader.result.split(',')[1];
        
        uploadMedia(file.name, fileContent);
      });
      fileReader.readAsDataURL(file);
      event.target.value = '';
    }
  }

  const folderNameChangeHandler = (event) => {
    const { value } = event.target;
    let errorMessage = validateCategoryName(value, mediaNames[mediaType], directoryNames)
    setNewFolderName(value)
    setErrors(errorMessage)
  }

  return (
    <>
      {
        isCreateModalActive &&
        <div className={elementStyles.overlay}>
          <FolderNamingModal 
            onClose={() => {
              setNewFolderName('')
              setIsCreateModalActive(false)
            }}
            onProceed={createHandler}
            folderNameChangeHandler={folderNameChangeHandler}
            title={newFolderName}
            errors={errors}
            folderType={`${mediaNames[mediaType]} directory`}
            proceedText='Create'
          />
        </div>
      }
      <Header
        siteName={siteName}
        backButtonText={`Back to ${customPath ? getPrevDirectoryName(customPath, mediaType) : 'Sites'}`}
        backButtonUrl={customPath ? `/sites/${siteName}/${getPrevDirectoryPath(customPath, mediaType)}` : '/sites'}
      />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>{mediaNames[mediaType][0].toUpperCase() + mediaNames[mediaType].substring(1)}</h1>
          </div>
          {/* Info segment */}
          <div className={contentStyles.segment}>
            <i className="bx bx-sm bx-info-circle text-dark" />
            <span><strong className="ml-1">Note:</strong> Upload {mediaNames[mediaType]} here to link to them in pages and resources. The maximum {mediaNames[mediaType].slice(0,-1)} size allowed is 5MB.</span>
          </div>
          {/* Creation buttons */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {/* Upload Media */}
              <FolderOptionButton
                title={`Upload new ${mediaNames[mediaType].slice(0,-1)}`}
                option={`upload-${mediaNames[mediaType].slice(0,-1)}`}
                onClick={() => document.getElementById('file-upload').click()}
              />
              <FolderOptionButton
                title="Create new directory"
                option="create-sub"
                isSubfolder={false}
                onClick={() => setIsCreateModalActive(true)}
              />
              { mediaType === 'images' ?
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
                :
                <input
                  onChange={onFileSelect}
                  onClick={(event) => {
                    // eslint-disable-next-line no-param-reassign
                    event.target.value = '';
                  }}
                  type="file"
                  id="file-upload"
                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                  text/plain, application/pdf"
                  hidden
                />
              }
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Directories title segment */}
          <div className={contentStyles.segment}>
            <span>Directories</span>
          </div>
          {/* Media directories */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {
                directories && directories.length > 0
                ? directories.map((directory, idx) => (
                    <FolderCard
                      displayText={deslugifyDirectory(directory.name)}
                      settingsToggle={() => {}}
                      key={directory.name}
                      pageType={mediaType}
                      linkPath={`${mediaType}/${encodeURIComponent(directory.path
                          .split('/')
                          .slice(1) // remove `images/files` prefix
                          .join('/')
                        )}`
                      }
                      siteName={siteName}
                      itemIndex={idx}
                      category={directory.name}
                      existingFolders={directoryNames}
                      mediaCustomPath={customPath}
                    />
                ))
                : (
                  <div className={contentStyles.segment}>
                    There are no {mediaNames[mediaType].slice(0,-1)} sub-directories in this directory.
                  </div>
                )
              }
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="invisible w-100 mt-3 mb-5" />
          </div>
          {/* Ungrouped Media title segment */}
          <div className={contentStyles.segment}>
            <span>Ungrouped {mediaNames[mediaType]}</span>
          </div>
          {/* Media segment */}
          <div className={contentStyles.contentContainerBars}>
            <div className={contentStyles.boxesContainer}>
              <div className={mediaStyles.mediaCards}>
                {/* Media */}
                {
                  media && media.length > 0
                  ? media.map((media) => (
                    <MediaCard
                      type={mediaNames[mediaType]}
                      media={media}
                      siteName={siteName}
                      onClick={() => setChosenMedia(media)}
                      key={media.fileName}
                    />
                  )) : (
                    <div className={contentStyles.segment}>
                      There are no {mediaNames[mediaType]} in this directory.
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          {/* End of media cards */}
        </div>
        {/* main section ends here */}
      </div>
      {
        chosenMedia
        && (
        <MediaSettingsModal
          type={mediaNames[mediaType].slice(0,-1)}
          media={chosenMedia}
          siteName={siteName}
          customPath={customPath}
          isPendingUpload={false}
          onClose={() => setChosenMedia(null)}
          onSave={() => window.location.reload()}
        />
        )
      }
      {
        pendingMediaUpload
        && (
        <MediaSettingsModal
          type={mediaNames[mediaType].slice(0,-1)}
          media={pendingMediaUpload}
          siteName={siteName}
          customPath={customPath}
          // eslint-disable-next-line react/jsx-boolean-value
          isPendingUpload
          onClose={() => setPendingMediaUpload(null)}
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

export default Media

Media.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  mediaType: PropTypes.string.isRequired,
};
