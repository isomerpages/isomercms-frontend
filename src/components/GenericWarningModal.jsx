import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import LoadingButton from './LoadingButton';


const GenericWarningModal = ({ displayTitle, displayText, onProceed, onCancel, proceedText, cancelText }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles['modal-warning']}>
      <div className={elementStyles.modalHeader}>
        <h1>
          {displayTitle}
        </h1>
      </div>
      <form className={elementStyles.modalContent}>
        <p>{displayText}</p>
        <div className={elementStyles.modalButtons}>
            <LoadingButton
                label={cancelText}
                disabledStyle={elementStyles.disabled}
                className={`ml-auto ${elementStyles.warning}`}
                callback={onCancel}
            />
            <LoadingButton
                label={proceedText}
                disabledStyle={elementStyles.disabled}
                className={`${elementStyles.blue}`}
                callback={onProceed}
            />
        </div>
      </form>
    </div>
  </div>
);

GenericWarningModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  proceedText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
};

export default GenericWarningModal;
