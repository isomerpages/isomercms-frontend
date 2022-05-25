import { useToast } from "@opengovsg/design-system-react"

import { DEFAULT_ERROR_TOAST_MSG } from "utils"

export const useErrorToast = () =>
  useToast({
    description: DEFAULT_ERROR_TOAST_MSG,
    status: "danger",
    duration: 5000,
    isClosable: true,
  })

export const useSuccessToast = () =>
  useToast({
    description: "Success!",
    status: "success",
    duration: 5000,
    isClosable: true,
  })
