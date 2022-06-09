import { useToast } from "@opengovsg/design-system-react"

import { DEFAULT_ERROR_TOAST_MSG } from "utils"

const DEFAULT_TOAST_PROPS = {
  duration: 5000,
  isClosable: true,
}

export const useErrorToast = () =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    description: DEFAULT_ERROR_TOAST_MSG,
    status: "danger",
  })

export const useSuccessToast = () =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    description: "Success!",
    status: "success",
  })

export const useWarningToast = () =>
  useToast({
    ...DEFAULT_TOAST_PROPS,
    status: "warning",
  })
