import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import LoadingButton from './LoadingButton';


const GenericWarningModal = ({ displayTitle, displayText, onProceed, onCancel, type }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles['modal-warning']}>
      <div className={elementStyles.modalHeader}>
        <h1>
          {displayTitle}
          {' '}
          { type }
        </h1>
      </div>
      <form className={elementStyles.modalContent}>
        <p>{displayText}</p>
        <div className={elementStyles.modalButtons}>
            <LoadingButton
                label="Yes"
                disabledStyle={elementStyles.disabled}
                className={`ml-auto ${elementStyles.blue}`}
                callback={onProceed}
            />
            <LoadingButton
                label="No"
                disabledStyle={elementStyles.disabled}
                className={elementStyles.warning}
                callback={onCancel}
            />
        </div>
      </form>
    </div>
  </div>
);

GenericWarningModal.propTypes = {
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default GenericWarningModal;
