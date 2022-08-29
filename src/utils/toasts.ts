import { useToast, UseToastReturn } from "@opengovsg/design-system-react"

import { DEFAULT_RETRY_MSG } from "./legacy"

const DEFAULT_ERROR_TOAST_MSG = `Something went wrong. ${DEFAULT_RETRY_MSG}`

const DEFAULT_TOAST_PROPS = {
  duration: 5000,
  isClosable: true,
}

export const useErrorToast = (): UseToastReturn =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    description: DEFAULT_ERROR_TOAST_MSG,
    status: "danger",
  })

export const useSuccessToast = (): UseToastReturn =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    description: "Success!",
    status: "success",
  })

export const useWarningToast = (): UseToastReturn =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    status: "warning",
  })
