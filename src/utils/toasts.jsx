import React from "react"
import { toast } from "react-toastify"

import Toast from "components/Toast"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { DEFAULT_ERROR_TOAST_MSG } from "utils"

export function errorToast(message) {
  return toast(
    <Toast
      notificationType="error"
      text={message || DEFAULT_ERROR_TOAST_MSG}
    />,
    {
      className: `${elementStyles.toastError} ${elementStyles.toastLong}`,
      toastId: "error",
    }
  )
}

export function successToast(message) {
  toast(<Toast notificationType="success" text={message || `Success!`} />, {
    className: `${elementStyles.toastSuccess}`,
    toastId: "success",
  })
}
