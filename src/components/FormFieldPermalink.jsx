import React from 'react';

import PropTypes from 'prop-types';

import elementStyles from '@styles/isomer-cms/Elements.module.scss';

const FormFieldPermalink = ({
  title,
  urlPrefix,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
}) => (
  <>
    <p className={elementStyles.formLabel}>{title}</p>
    <div style={{ display: 'flex' }}>
      <p className={`${elementStyles.formLabel} ${elementStyles.permalink}`}>
        {urlPrefix}
            <input
              type="text"
              value={value}
              defaultValue={defaultValue}
              id={id}
              autoComplete="off"
              required={isRequired}
              className={`${elementStyles.permalinkSetter} ${errorMessage ? `${elementStyles.error}` : null}`}
              onChange={onFieldChange}
            />
          /
      </p>
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
};

FormFieldPermalink.defaultProps = {
  defaultValue: undefined,
};
