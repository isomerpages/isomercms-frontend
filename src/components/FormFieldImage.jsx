import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldImage = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <input
      type="text"
      placeholder={title}
      value={value}
      defaultValue={defaultValue}
      id={id}
      autoComplete="off"
      required={isRequired}
      className={errorMessage ? `${elementStyles.error}` : null}
      style={style}
      onChange={onFieldChange}
    />
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

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
