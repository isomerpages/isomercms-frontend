import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from './LoadingButton'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const SaveDeleteButtons = ({ saveLabel, deleteLabel, isDisabled, isSaveDisabled, isDeleteDisabled, hasDeleteButton, saveCallback, deleteCallback }) => {
  const shouldDisableSave = isSaveDisabled ? isSaveDisabled : isDisabled
  const shouldDisableDelete = isDeleteDisabled ? isDeleteDisabled : isDisabled
  return (
    <div className={elementStyles.modalButtons}>
      { hasDeleteButton
        ? (
          <LoadingButton
            label={deleteLabel || 'Delete'}
            disabled={shouldDisableDelete}
            disabledStyle={elementStyles.disabled}
            className={`ml-auto ${shouldDisableDelete ? elementStyles.disabled : elementStyles.warning}`}
            callback={deleteCallback}
          />
        ) : null}
      <LoadingButton
        label={saveLabel || 'Save'}
        disabled={shouldDisableSave}
        disabledStyle={elementStyles.disabled}
        className={`${hasDeleteButton ? null : `ml-auto`} ${shouldDisableSave ? elementStyles.disabled : elementStyles.blue}`}
        callback={saveCallback}
      />
      
    </div>
  )
}

SaveDeleteButtons.propTypes = {
  saveLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSaveDisabled: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  hasDeleteButton: PropTypes.bool.isRequired,
  saveCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
};

export default SaveDeleteButtons