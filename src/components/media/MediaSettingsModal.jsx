import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';

import FormField from '../FormField';
import SaveDeleteButtons from '../SaveDeleteButtons';

import { validateMediaSettings } from '../../utils/validators';
import {
  DEFAULT_RETRY_MSG,
} from '../../utils'
import { errorToast, successToast } from '../../utils/toasts';
import { createMedia, renameMedia } from '../../api';
import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY } from '../../constants'

import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';

const MediaSettingsModal = ({
  type,
  siteName,
  onClose,
  onSave,
  media,
  mediaFileNames,
  isPendingUpload,
  customPath,
}) => {
  const fileName = media.fileName || ''
  const [newFileName, setNewFileName] = useState(fileName)
  const errorMessage = validateMediaSettings(newFileName, mediaFileNames)
  const queryClient = useQueryClient()

  // Handling save
  const { mutateAsync: saveHandler } = useMutation(
    () => {
      if (isPendingUpload) {
        // Creating a new file
        return createMedia({siteName, type, customPath, newFileName, content: media.content})
      } else {
        // Renaming an existing file
        return renameMedia({siteName, type, customPath, fileName, newFileName})
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
        queryClient.invalidateQueries(type === 'images' ? [IMAGE_CONTENTS_KEY, customPath] : [DOCUMENT_CONTENTS_KEY, customPath])
      },
      onSettled: () => {
        onSave(newFileName)
      },
    }
  )

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
                src={isPendingUpload ? `data:image/png;base64,${media.content}`
                  : (
                    `https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${media.path}${media.path.endsWith('.svg')
                      ? '?sanitize=true'
                      : ''}`
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
            isSaveDisabled={errorMessage || (!isPendingUpload && fileName === newFileName)}
            hasDeleteButton={false}
            saveCallback={saveHandler}
            isLoading={!!!media}
          />
        </form>
      </div>
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
  mediaFileNames: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(['images', 'files']).isRequired,
  siteName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
  customPath: PropTypes.string,
};
