import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import LoadingButton from './LoadingButton';
import parse from 'html-react-parser';


const GenericWarningModal = ({ displayTitle, displayText, onProceed, onCancel, proceedText, cancelText }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles['modal-warning']}>
      <div className={elementStyles.modalHeader}>
        <h1>
          {displayTitle}
        </h1>
      </div>
      <div className={elementStyles.modalContent}>
        <p>{parse(displayText)}</p>
      </div>
      <div className={elementStyles.modalButtons}>
        { cancelText && onCancel && 
          <LoadingButton
              label={cancelText}
              disabledStyle={elementStyles.disabled}
              className={`${elementStyles.warning}`}
              callback={onCancel}
          />
        }
        { proceedText && onProceed &&
          <LoadingButton
              label={proceedText}
              disabledStyle={elementStyles.disabled}
              className={`${elementStyles.blue}`}
              callback={onProceed}
          />
        }
      </div>
    </div>
  </div>
);

GenericWarningModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  onProceed: PropTypes.func,
  onCancel: PropTypes.func,
  proceedText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default GenericWarningModal;
