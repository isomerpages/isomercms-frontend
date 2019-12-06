import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldHorizontal = ({
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
    <div className={elementStyles.formColor}>
      <p className={elementStyles.formLabel} style={{ 'grid-column': '1' }}>{title}</p>
      <input
        type="text"
        placeholder={title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={`form-control ${errorMessage ? `${elementStyles.error}` : null}`}
        style={{ ...style, 'grid-column': '2' }}
        onChange={onFieldChange}
      />
      <div className={elementStyles.formColorBox} style={{ background: value }} />
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormFieldHorizontal;

FormFieldHorizontal.propTypes = {
  title: PropTypes.string.isRequired,
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
