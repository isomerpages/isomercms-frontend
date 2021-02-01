import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from './LoadingButton'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const SaveDeleteButtons = ({ saveLabel, deleteLabel, isDisabled, hasDeleteButton, saveCallback, deleteCallback }) => {
  return (
    <div className={elementStyles.modalButtons}>
      { hasDeleteButton
        ? (
          <LoadingButton
            label={deleteLabel || 'Delete'}
            disabled={isDisabled}
            disabledStyle={elementStyles.disabled}
            className={`ml-auto ${isDisabled ? elementStyles.disabled : elementStyles.warning}`}
            callback={deleteCallback}
          />
        ) : null}
      <LoadingButton
        label={saveLabel || 'Save'}
        disabled={isDisabled}
        disabledStyle={elementStyles.disabled}
        className={`${hasDeleteButton ? null : `ml-auto`} ${isDisabled ? elementStyles.disabled : elementStyles.blue}`}
        callback={saveCallback}
      />
      
    </div>
  )
}

SaveDeleteButtons.propTypes = {
  saveLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  hasDeleteButton: PropTypes.bool.isRequired,
  saveCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
};

export default SaveDeleteButtons