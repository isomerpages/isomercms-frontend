import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';

const Toast = ({ notificationType, text }) => {
  const toastImg = () => {
    switch(notificationType) {
      case 'info':
        return 'bxs-info-circle'
      case 'success':
        return 'bxs-check-circle'
      case 'error':
        return 'bxs-x-circle'
      case 'warning':
        return 'bxs-error'
      default: 
        return ''
    }
  }
  return (
    <div>
      <i className={`bx bx-sm ${toastImg()}`}/>
      {text}
    </div>
  )
}

export default Toast