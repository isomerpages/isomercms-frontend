import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import FormField from '../FormField';
import SaveDeleteButtons from '../SaveDeleteButtons';

import { validateMediaSettings } from '../../utils/validators';

import { 
  useCreateMediaHook,
  useMediaHook,
  useUpdateMediaHook,
} from '../../hooks/mediaHooks'

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

  const { mutateAsync: updateMediaSaveHandler } = useUpdateMediaHook(siteName, type, customPath, onSave)
  const { mutateAsync: createMediaSaveHandler } = useCreateMediaHook(siteName, type, customPath, onSave)
  const { data: imageURL } = useMediaHook(siteName, type, media.path)

  const saveHandler = () => {
    return isPendingUpload 
      ? createMediaSaveHandler({siteName, type, customPath, newFileName, content: media.content})
      : updateMediaSaveHandler({siteName, type, customPath, fileName, newFileName})
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>
            {isPendingUpload ? `Upload new ${type.slice(0,-1)}` : `Edit ${type.slice(0,-1)} details`}
          </h1>
          <button type="button" id='closeMediaSettingsModal' onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        { type === 'images'
          ? (
            <div className={mediaStyles.editImagePreview}>
              <img
                alt={`${media.fileName}`}
                src={
                  isPendingUpload 
                    ? `data:image/png;base64,${media.content}`
                    : imageURL || '/placeholder_no_image.png'
                }
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
            isLoading={!media}
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
  onSave: PropTypes.func.isRequired,
  isPendingUpload: PropTypes.bool.isRequired,
  customPath: PropTypes.string,
};
