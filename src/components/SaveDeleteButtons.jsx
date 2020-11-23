import React from 'react';
import LoadingButton from './LoadingButton'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const SaveDeleteButtons = ({ isDisabled, hasDeleteButton, saveCallback, deleteCallback }) => {
  return (
    <div className={elementStyles.modalButtons}>
      { hasDeleteButton
        ? (
          <LoadingButton
            label="Delete"
            disabled={isDisabled}
            disabledStyle={elementStyles.disabled}
            className={`ml-auto ${isDisabled ? elementStyles.disabled : elementStyles.warning}`}
            callback={deleteCallback}
          />
        ) : null}
      <LoadingButton
        label="Save"
        disabled={isDisabled}
        disabledStyle={elementStyles.disabled}
        className={`${hasDeleteButton ? null : `ml-auto`} ${isDisabled ? elementStyles.disabled : elementStyles.blue}`}
        callback={saveCallback}
      />
      
    </div>
  )
}

export default SaveDeleteButtons