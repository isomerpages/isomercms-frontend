import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldFile = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  isRequired,
  style,
  onInlineButtonClick,
  inlineButtonText,
  onFieldChange,
  disabled,
}) => {
  useEffect(() => {
    if (_.isString(value)) {
      const event = {
        target: {
          id: 'fileUrl',
          value,
        },
      };
      onFieldChange(event);
    }
  }, [value]);
  return (
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
          className={`${disabled ? elementStyles.disabled : elementStyles.blue} text-nowrap`}
          onClick={onInlineButtonClick}
          disabled
        >
          { inlineButtonText }
        </button>
        )
      }
      </div>
      <span className={elementStyles.error}>{errorMessage}</span>
    </>
  );
};

export default FormFieldFile;

FormFieldFile.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
  inlineButtonText: PropTypes.string,
  onInlineButtonClick: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

FormFieldFile.defaultProps = {
  defaultValue: undefined,
  style: undefined,
  inlineButtonText: '',
};
