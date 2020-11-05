import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormField = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
  placeholder,
  disabled,
  fixedMessage,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <div className="d-flex text-nowrap">
      {fixedMessage
        ? <p className={elementStyles.formFixedText}>{fixedMessage}</p>
        : null
      }
      <input
        type="text"
        placeholder={placeholder ? placeholder : title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={errorMessage ? `${elementStyles.error}` : null}
        style={style}
        onChange={onFieldChange}
        disabled={disabled}
      />
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormField;

FormField.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  style: PropTypes.string,
};

FormField.defaultProps = {
  defaultValue: undefined,
  style: undefined,
  errorMessage: null,
};
