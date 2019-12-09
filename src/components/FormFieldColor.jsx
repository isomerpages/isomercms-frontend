import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import ColorPicker from './ColorPicker';

const FormFieldColor = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  onColorClick,
  isRequired,
  style,
}) => (
  <>
    <div className={elementStyles.formHorizontal}>
      <p className={elementStyles.formHorizontalLabel}>{title}</p>
      <input
        type="text"
        placeholder={title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={`${elementStyles.formColorInput} ${errorMessage ? `${elementStyles.error}` : null}`}
        style={style}
        onChange={onFieldChange}
      />
      <ColorPicker
        value={value}
        onColorClick={onColorClick}
      />
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormFieldColor;

FormFieldColor.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onColorClick: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
};

FormFieldColor.defaultProps = {
  defaultValue: undefined,
  style: undefined,
};
