import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useQuery } from 'react-query'

import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

import MediaCard from './MediaCard';
import { MediaSearchBar } from './MediaSearchBar';
import LoadingButton from '../LoadingButton';
import useRedirectHook from '../../hooks/useRedirectHook';

import { errorToast } from '../../utils/toasts';
import { getMedia } from '../../api';
import { deslugifyDirectory } from '../../utils';
import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY } from '../../constants'

const mediaNames = {
  image: 'images',
  file: 'files',
}

const MediaModal = ({
  siteName,
  onClose,
  onMediaSelect,
  type,
  readFileToStageUpload,
  setUploadPath,
}) => {
  const [medias, setMedias] = useState([])
  const [filteredMedias, setFilteredMedias] = useState([])
  const [directories, setDirectories] = useState([])
  const [filteredDirectories, setFilteredDirectories] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const [customPath, setCustomPath] = useState('')
  const [mediaSearchTerm, setMediaSearchTerm] = useState('')
  const { setRedirectToNotFound } = useRedirectHook()

  const { data: mediaData } = useQuery(
    type === 'image' ? [IMAGE_CONTENTS_KEY, customPath] : [DOCUMENT_CONTENTS_KEY, customPath],
    () => getMedia(siteName, customPath || '', mediaNames[type]),
    {
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast()
        }
      },
    },
  )

  useEffect(() => {
    let _isMounted = true

    if (mediaData) {
      const {
        respMedia,
        respDirectories,
      } = mediaData

      const medias = []
      respMedia.forEach((mediaFile) => { if (mediaFile.fileName !== `.keep`) medias.push(mediaFile) })

      const directories = []
      respDirectories.forEach((mediaDir) => directories.push({...mediaDir, fileName: deslugifyDirectory(mediaDir.fileName)}))

      if (_isMounted) {
        setMedias(medias)
        setFilteredMedias(medias)
        setDirectories(directories)
        setFilteredDirectories(directories)
      }
    }

    return () => {
      _isMounted = false
    }
  }, [mediaData])

  const filterMediaByFileName = (medias, filterTerm) => {
    const filteredMedias = medias.filter((media) => {
      if (media.fileName.toLowerCase().includes(filterTerm.toLowerCase())) return true
      return false
    })
    return filteredMedias
  }

  const searchChangeHandler = (event) => {
    const { target: { value } } = event
    const filteredMedias = filterMediaByFileName(medias, value)
    const filteredDirectories = filterMediaByFileName(directories, value)
    setMediaSearchTerm(value)
    setFilteredMedias (filteredMedias)
    setFilteredDirectories(filteredDirectories)
  }

  const BreadcrumbButton = ({ name, idx }) => {
    const newCustomPath = customPath.split('/').slice(0, idx+1).join('/') // retrieves paths elements up to (excluding) element idx
    return (
      <button type="button" onClick={() => setCustomPath(newCustomPath)}>
        {name}
      </button>
    )
  }

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={mediaStyles.mediaModal}>
          <div className={elementStyles.modalHeader}>
            <h1 className="pl-5 mr-auto">{`Select ${type === 'file' ? 'File' : 'Image'}`}</h1>
            {/* Search medias */}
            <MediaSearchBar value={mediaSearchTerm} onSearchChange={searchChangeHandler} />
            {/* Upload medias */}
            <button
              type="button"
              className={elementStyles.blue}
              onClick={() => document.getElementById('file-upload').click()}
            >{`Add new ${type}`}
            </button>
            <input
              onChange={(event) => {
                setUploadPath(customPath)
                readFileToStageUpload(event)
              }}
              onClick={(event) => {
                // eslint-disable-next-line no-param-reassign
                event.target.value = '';
              }}
              type="file"
              id="file-upload"
              accept={type === 'image' 
                ? "image/*" 
                : "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf"
              }
              hidden
            />
            {/* Close */}
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Breadcrumb */}
          {
            <div className={contentStyles.segment}>
              { customPath !== '' 
                ? 
                  <>
                  <BreadcrumbButton name={`${type === 'file' ? 'Files' : 'Images'}`} idx={-1}/>
                  { 
                    customPath.split("/").map((folderName, idx, arr) => {
                      return idx === arr.length - 1
                      ? <> > <strong className="ml-1"> {deslugifyDirectory(folderName)}</strong></>
                      : <> > <BreadcrumbButton idx={idx} name={deslugifyDirectory(folderName)}/></>
                    })
                  }
                  </>
                : <strong className="ml-1">{`${type === 'file' ? 'Files' : 'Images'}`}</strong>
              }
            </div>
          }
          <div className={mediaStyles.mediaCards}>
            {/* Directories */}
            {filteredDirectories.map((directory) => (
              <MediaCard
                type='dir'
                media={directory}
                siteName={siteName}
                onClick={() => setCustomPath((prevState) => prevState ? `${prevState}/${directory.name}` : directory.name)}
                key={directory.path}
              />
            ))}
            {/* Media */}
            {filteredMedias.map((media) => (
              <MediaCard
                type={type}
                media={media}
                siteName={siteName}
                onClick={() => setSelectedFile(media)}
                key={media.path}
                isSelected={media.path === selectedFile?.path}
              />
            ))}
          </div>
          {/* Flexbox parent needs to be full-width - https://stackoverflow.com/a/49029061 */}
          <div className={`d-flex ${elementStyles.modalFooter}`}>
            <div className="ml-auto mt-3">
              <LoadingButton
                  label={`Select ${type}`}
                  disabledStyle={elementStyles.disabled}
                  disabled={!selectedFile}
                  className={elementStyles.blue}
                  callback={() => {
                    if (selectedFile) onMediaSelect(`/${decodeURIComponent(selectedFile.path)}`)
                  }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MediaModal

MediaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['file', 'image']).isRequired,
  setMediaSearchTerm: PropTypes.func.isRequired,
};
