import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldHorizontal = ({
  title,
  defaultValue,
  placeholder,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
}) => (
  <>
    <div className={elementStyles.formHorizontal}>
      <p className={elementStyles.formHorizontalLabel}>{`${title}:`}</p>
      <input
        type="text"
        placeholder={placeholder ? placeholder : title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={`${elementStyles.formHorizontalInput} ${errorMessage ? `${elementStyles.error}` : null}`}
        style={style}
        onChange={onFieldChange}
      />
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormFieldHorizontal;

FormFieldHorizontal.propTypes = {
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
};

FormFieldHorizontal.defaultProps = {
  defaultValue: undefined,
  style: undefined,
};
