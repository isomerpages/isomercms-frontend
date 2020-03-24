import React from 'react';
import PropTypes from 'prop-types';

/**
 * This Alert component is the React extension of Bootstrap's alert component
 * https://getbootstrap.com/docs/4.4/components/alerts/
 * @param {string} message - message to show
 * @param {string} type - color of alert box
 */
const Alert = ({ message, type }) => (
  <div className="d-flex justify-content-center fixed-bottom mt-3">
    <div className={`alert alert-${type}`} role="alert">
      { message }
    </div>
  </div>
);

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']).isRequired,
};

export default Alert;
