import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormField = ({
  title,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <input 
      type="text"
      placeholder={title}
      value={value} 
      id={id} 
      autoComplete="off"
      required={isRequired}
      className={errorMessage ? `${elementStyles.error}` : null}
      onChange={onFieldChange} />
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
)

export default FormField

FormField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired
};
