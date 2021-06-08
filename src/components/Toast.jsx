import React from "react"
import PropTypes from "prop-types"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"

const Toast = ({ notificationType, text }) => {
  const toastImg = () => {
    switch (notificationType) {
      case "info":
        return "bxs-info-circle"
      case "success":
        return "bxs-check-circle"
      case "error":
        return "bxs-x-circle"
      case "warning":
        return "bxs-error"
      default:
        return ""
    }
  }
  return (
    <div className={elementStyles.toastContent}>
      <i className={`bx bx-sm ${toastImg()}`} />
      {text}
    </div>
  )
}

Toast.propTypes = {
  notificationType: PropTypes.string,
  text: PropTypes.string.isRequired,
}

export default Toast
