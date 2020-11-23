import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const AlertModal = ({ displayTitle, displayText, onClose  }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles['modal-warning']}>
      <div className={elementStyles.modalHeader}>
        <h1>
          { displayTitle }
        </h1>
        <button type="button" onClick={onClose}>
          <i className="bx bx-x" />
        </button>
      </div>
      <div className={elementStyles.modalContent}>
        <p>{displayText}</p>
      </div>
    </div>
  </div>
);

AlertModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
