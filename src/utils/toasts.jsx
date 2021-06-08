import React from "react"
import { toast } from "react-toastify"

import { DEFAULT_ERROR_TOAST_MSG } from "@src/utils"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"

import Toast from "@components/Toast"

export function errorToast(message) {
  return toast(
    <Toast
      notificationType="error"
      text={message || DEFAULT_ERROR_TOAST_MSG}
    />,
    {
      className: `${elementStyles.toastError} ${elementStyles.toastLong}`,
      toastId: "error",
      autoClose: false,
    }
  )
}

export function successToast(message) {
  toast(<Toast notificationType="success" text={message || `Success!`} />, {
    className: `${elementStyles.toastSuccess}`,
    toastId: "success",
    autoClose: false,
  })
}
