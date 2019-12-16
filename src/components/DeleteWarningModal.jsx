import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';


const DeleteWarningModal = ({ onDelete, onCancel, type }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles['modal-warning']}>
      <div className={elementStyles.modalHeader}>
        <h1>
          Delete
          {' '}
          { type }
        </h1>
      </div>
      <form className={elementStyles.modalContent}>
        <p>Are you sure you want to delete this?</p>
        <div className={elementStyles.modalButtons}>
          <button className={elementStyles.blue} type="button" onClick={onCancel}>Cancel</button>
          <button className={elementStyles.warning} type="button" onClick={onDelete}>Delete</button>
        </div>
      </form>
    </div>
  </div>
);

DeleteWarningModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteWarningModal;
