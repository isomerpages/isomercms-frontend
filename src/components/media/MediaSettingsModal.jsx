import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

import FormField from '../FormField';
import DeleteWarningModal from '../DeleteWarningModal';
import SaveDeleteButtons from '../SaveDeleteButtons';

import { validateFileName } from '../../utils/validators';
import {
  DEFAULT_RETRY_MSG, fetchImageURL,
} from '../../utils'
import { errorToast, successToast } from '../../utils/toasts';
import { getMediaDetails, createMedia, renameMedia, deleteMedia } from '../../api';
import { IMAGE_DETAILS_KEY, IMAGE_CONTENTS_KEY, DOCUMENT_DETAILS_KEY, DOCUMENT_CONTENTS_KEY} from '../../constants'

import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';

const MediaSettingsModal = ({ type, siteName, onClose, onSave, media, isPendingUpload, customPath }) => {
  const fileName = media.fileName
  const [newFileName, setNewFileName] = useState(fileName)
  const [sha, setSha] = useState()
  const [content, setContent] = useState()
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const errorMessage = validateFileName(newFileName);
  const queryClient = useQueryClient()

  // Retrieve media information
  const { data: mediaData } = useQuery(
    type === 'images' ? [IMAGE_DETAILS_KEY, customPath, fileName] : [DOCUMENT_DETAILS_KEY, customPath, fileName],
    () => {if (!isPendingUpload) return getMediaDetails({siteName, type, customPath, fileName})},
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

  // Handling save
  const { mutateAsync: saveHandler } = useMutation(
    () => {
      if (isPendingUpload) {
        // Creating a new file
        return createMedia({siteName, type, customPath, newFileName, content})
      } else {
        // Renaming an existing file
        return renameMedia({siteName, type, customPath, sha, content, fileName, newFileName})
      }
    },
    {
      onError: (err) => {
        if (err?.response?.status === 409) {
          // Error due to conflict in name
          errorToast(`Another ${type.slice(0,-1)} with the same name exists. Please choose a different name.`)
        } else if (err?.response?.status === 413 || err?.response === undefined) {
          // Error due to file size too large - we receive 413 if nginx accepts the payload but it is blocked by our express settings, and undefined if it is blocked by nginx
          errorToast(`Unable to upload as the ${type.slice(0,-1)} size exceeds 5MB. Please reduce your ${type.slice(0,-1)} size and try again.`)
        } else {
          errorToast(`There was a problem trying to save this ${type.slice(0,-1)}. ${DEFAULT_RETRY_MSG}`)
        }
        console.log(err);
      },
      onSuccess: () => {
        successToast(`Successfully ${isPendingUpload ? `created new` : `renamed`} ${type.slice(0,-1)}!`)
        queryClient.removeQueries('images/'+(customPath===undefined?'':customPath+'/')+fileName)
        queryClient.invalidateQueries(type === 'images' ? [IMAGE_CONTENTS_KEY, customPath] : [DOCUMENT_CONTENTS_KEY, customPath])
      },
      onSettled: () => {
        onSave(newFileName)
      },
    }
  )

  // Handling delete
  const { mutateAsync: deleteHandler } = useMutation(
    () => deleteMedia({siteName, type, sha, customPath, fileName}),
    {
      onError: () => errorToast(`There was a problem trying to delete this ${type.slice(0,-1)}. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => {
        successToast(`Successfully deleted ${type.slice(0,-1)}!`)
        queryClient.invalidateQueries(type === 'images' ? [IMAGE_CONTENTS_KEY, customPath] : [DOCUMENT_CONTENTS_KEY, customPath])
      },
      onSettled: () => {
        setCanShowDeleteWarningModal(false)
        queryClient.removeQueries('images/'+(customPath===undefined?'':customPath+'/')+fileName)
        onSave()
      },
    }
  )

  useEffect(() => {
    let _isMounted = true
    if (_isMounted && isPendingUpload) {
      const { content:retrievedContent } = media
      setContent(retrievedContent)
      return
    }
    if (mediaData) {
      const retrievedSha = mediaData.sha
      const retrievedContent = mediaData.content
      if (_isMounted) {
        setContent(retrievedContent)
        setSha(retrievedSha)
      }
    }

    return () => {
      _isMounted = false
    }
  }, [mediaData])

  const {data: imageURL, status} = useQuery(media.path, () => fetchImageURL(siteName, media.path), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 // 60 seconds
  })

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>
            {isPendingUpload ? `Upload new ${type.slice(0,-1)}` : `Edit ${type.slice(0,-1)} details`}
          </h1>
          <button type="button" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        { type === 'images'
          ? (
            <div className={mediaStyles.editImagePreview}>
              <img
                alt={`${media.fileName}`}
                src={isPendingUpload ? `data:image/png;base64,${content}`
                  : (
                        (status === 'success')?imageURL:'/placeholder_no_image.png'
                  )}
              />
            </div>
          )
          : (
            <div className={mediaStyles.editFilePreview}>
              <p>{media.fileName.split('.').pop().toUpperCase()}</p>
            </div>
          )}
        <form className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            <FormField
              title="File name"
              value={newFileName}
              errorMessage={errorMessage}
              id="file-name"
              isRequired
              onFieldChange={(e) => setNewFileName(e.target.value)}
            />
          </div>
          <SaveDeleteButtons
            saveLabel={isPendingUpload ? "Upload" : "Save"}
            isDisabled={isPendingUpload ? false : !sha}
            isSaveDisabled={isPendingUpload ? false : (fileName === newFileName || errorMessage || !sha)}
            hasDeleteButton={!isPendingUpload}
            saveCallback={saveHandler}
            deleteCallback={() => setCanShowDeleteWarningModal(true)}
            isLoading={isPendingUpload ? false : !sha}
          />
        </form>
      </div>
      {
        canShowDeleteWarningModal
        && (
          <DeleteWarningModal
            onCancel={() => setCanShowDeleteWarningModal(false)}
            onDelete={deleteHandler}
            type="image"
          />
        )
      }
    </div>
  );
}

export default MediaSettingsModal

MediaSettingsModal.propTypes = {
  media: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['images', 'files']).isRequired,
  siteName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
  customPath: PropTypes.string,
};
