import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import MediasModal from '../components/media/MediaModal';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

const FormFieldItem = ({
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
}) => {
  const [isSelectingItem, setIsSelectingItem] = useState(false)
  const [isFileStagedForUpload, setIsFileStagedForUpload] = useState(false)
  const [stagedFileDetails, setStagedFileDetails] = useState()

  const onItemClick = (path) => {
    setIsSelectingItem(false)
    const event = {
      target: {
        id: id,
        value: path,
      },
    };
    onFieldChange(event);
  }

  const toggleItemModal = () => {
    setIsSelectingItem(!isSelectingItem)
  }
  
  const toggleItemAndSettingsModal = () => {
    setIsSelectingItem(!isSelectingItem)
    setIsFileStagedForUpload(!isFileStagedForUpload)
  }

  const stageFileForUpload = (fileName, fileData) => {
    const baseFolder = type === 'image' ? 'images' : 'files';
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
            className={`${elementStyles.blue} text-nowrap`}
            onClick={() => setIsSelectingItem(true)}
          >
            { inlineButtonText }
          </button>
          )
        }
        {
          isSelectingItem && (
            <MediasModal
              type={type}
              siteName={siteName}
              onMediaSelect={onItemClick}
              toggleItemModal={toggleItemModal}
              readFileToStageUpload={readFileToStageUpload}
              onClose={() => setIsSelectingItem(false)}
            />
          )
        }
        {
          isFileStagedForUpload && (
            <MediaSettingsModal
              type={type}
              siteName={siteName}
              onClose={() => setIsFileStagedForUpload(false)}
              onSave={toggleItemAndSettingsModal}
              media={stagedFileDetails}
              isPendingUpload="true"
            />
          )
        }
      </div>
      <span className={elementStyles.error}>{errorMessage}</span>
    </>
  );
};

export default FormFieldItem;

FormFieldItem.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
};

FormFieldItem.defaultProps = {
  defaultValue: undefined,
  style: undefined,
};
