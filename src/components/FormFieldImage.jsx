import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import MediasModal from '../components/media/MediaModal';

const FormFieldImage = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
  inlineButtonText = "Choose Image",
  siteName,
  placeholder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onImageClick = (path) => {
    setIsModalOpen(false)
      const event = {
        target: {
          id: id,
          value: path,
          parentElement: {
            parentElement: {
              id: '',
            },
          },
        },
      };
      onFieldChange(event);
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
            onClick={() => setIsModalOpen(true)}
          >
            { inlineButtonText }
          </button>
          )
        }
        {
          isModalOpen && (
            <MediasModal
              type="image"
              siteName={siteName}
              onMediaSelect={onImageClick}
              onClose={() => setIsModalOpen(false)}
            />
          )
        }
      </div>
      <span className={elementStyles.error}>{errorMessage}</span>
    </>
  );
};

export default FormFieldImage;

FormFieldImage.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
};

FormFieldImage.defaultProps = {
  defaultValue: undefined,
  style: undefined,
};
