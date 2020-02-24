import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldFile = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  isRequired,
  style,
  onFileSelect,
  inlineButtonText,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <div className="d-flex border">
      <input
        type="text"
        placeholder={title}
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
          onClick={onFileSelect}
        >
          { inlineButtonText }
        </button>
        )
      }
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormFieldFile;

FormFieldFile.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
  inlineButtonText: PropTypes.string,
};

FormFieldFile.defaultProps = {
  defaultValue: undefined,
  style: undefined,
  inlineButtonText: '',
};
