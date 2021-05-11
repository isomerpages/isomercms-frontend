import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MediaModal from './media/MediaModal';
import MediaSettingsModal from './media/MediaSettingsModal';

import { successToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';


const FormFieldMedia = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
  inlineButtonText = "Choose Item",
  siteName,
  placeholder,
  type,
  isDisabled = false,
}) => {
  const [isSelectingItem, setIsSelectingItem] = useState(false)
  const [isFileStagedForUpload, setIsFileStagedForUpload] = useState(false)
  const [stagedFileDetails, setStagedFileDetails] = useState()
  const [uploadPath, setUploadPath] = useState('')

  const onItemClick = (path) => {
    setIsSelectingItem(false)
    const event = {
      target: {
        id: id,
        value: path,
      },
    };
    successToast(`Successfully updated ${title.toLowerCase()}!`)
    onFieldChange(event);
  }

  const toggleItemModal = () => {
    setIsSelectingItem(!isSelectingItem)
  }
  
  const toggleItemAndSettingsModal = (newFileName) => {
    const baseFolder = type;
    setIsFileStagedForUpload(!isFileStagedForUpload)
    onItemClick(`/${baseFolder}/${uploadPath ? `${uploadPath}/` : ''}${newFileName}`)
  }

  const stageFileForUpload = (fileName, fileData) => {
    const baseFolder = type;
    setStagedFileDetails({
      path: `${baseFolder}%2F${fileName}`,
      content: fileData,
      fileName,
    })
    setIsFileStagedForUpload(true)
  }

  const readFileToStageUpload = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the image
       * fileReader returns  `data:application/pdf;base64, {fileContent}`
       * hence the split
       */

      const fileData = fileReader.result.split(',')[1];
      stageFileForUpload(fileName, fileData);
    });
    fileReader.readAsDataURL(event.target.files[0]);
    toggleItemModal()
  }

  return (
    <>
      <p className={elementStyles.formLabel}>{title}</p>
      <div className="d-flex border">
        <input
          type="text"
          placeholder={placeholder ? placeholder : title}
          value={value}
          defaultValue={defaultValue}
          id={id}
          autoComplete="off"
          required={isRequired}
          className={errorMessage ? `${elementStyles.error}` : 'border-0'}
          style={style}
          disabled
        />
        {
          inlineButtonText
          && (
          <button
            type="button"
            className={`${isDisabled ? elementStyles.disabled : elementStyles.blue} text-nowrap`}
            onClick={() => setIsSelectingItem(true)}
            disabled={isDisabled}
          >
            { inlineButtonText }
          </button>
          )
        }
        {
          isSelectingItem && (
            <MediaModal
              siteName={siteName}
              onClose={() => setIsSelectingItem(false)}
              onMediaSelect={onItemClick}
              type={type}
              readFileToStageUpload={readFileToStageUpload}
              setUploadPath={setUploadPath}
            />
          )
        }
        {
          isFileStagedForUpload && (
            <MediaSettingsModal
              type={type === 'images' ? 'image': 'file'}
              siteName={siteName}
              customPath={uploadPath}
              onClose={() => setIsFileStagedForUpload(false)}
              onSave={toggleItemAndSettingsModal}
              media={stagedFileDetails}
              isPendingUpload
            />
          )
        }
      </div>
      <span className={elementStyles.error}>{errorMessage}</span>
    </>
  );
};

export default FormFieldMedia;

FormFieldMedia.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  style: PropTypes.string,
  type: PropTypes.oneOf(['files', 'images']).isRequired,
};

FormFieldMedia.defaultProps = {
  defaultValue: undefined,
  style: undefined,
};
