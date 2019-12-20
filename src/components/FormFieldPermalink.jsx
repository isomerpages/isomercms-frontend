import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FormFieldPermalink = ({
  title,
  urlPrefix,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  isActive,
  togglePermalinkSetter,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <div style={{ display: 'flex' }}>
      <p
        style={{
          paddingTop: '0px',
          paddingLeft: '10px',
          marginBottom: '0px',
          lineHeight: '31px',
          marginRight: '20px',
        }}
        className={elementStyles.formLabel}
      >
        {urlPrefix}
        { !isActive
          ? <b>{value}</b>
          : (
            <input
              type="text"
              value={value}
              defaultValue={defaultValue}
              id={id}
              autoComplete="off"
              required={isRequired}
              className={errorMessage ? `${elementStyles.error}` : null}
              style={{
                marginLeft: '2px',
                marginRight: '2px',
                width: '50%',
                lineHeight: '21px',
              }}
              onChange={onFieldChange}
            />
          )}
          /
      </p>
      { !isActive
        ? <button type="button" onClick={togglePermalinkSetter}>EDIT</button>
        : null}
    </div>
    <span className={elementStyles.error}>{errorMessage}</span>
  </>
);

export default FormFieldPermalink;


FormFieldPermalink.propTypes = {
  title: PropTypes.string.isRequired,
  urlPrefix: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  togglePermalinkSetter: PropTypes.func.isRequired,
};

FormFieldPermalink.defaultProps = {
  defaultValue: undefined,
};
