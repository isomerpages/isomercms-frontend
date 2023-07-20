import { UseToastOptions } from "@chakra-ui/react"
import { useToast } from "@opengovsg/design-system-react"
import type { SetRequired } from "type-fest"

import { DEFAULT_RETRY_MSG } from "./legacy"

const DEFAULT_ERROR_TOAST_MSG = `Something went wrong. ${DEFAULT_RETRY_MSG}`

const DEFAULT_TOAST_PROPS = {
  duration: 5000,
  isClosable: true,
}

// Not specifying return type because type is in the argument
const useIsomerToast = (args: UseToastOptions) => {
  const toast = useToast(args)
  const wrappedToast = ({
    id,
    ...rest
  }: SetRequired<UseToastOptions, "id">) => {
    if (!toast.isActive(id))
      return toast({
        ...rest,
        id,
      })
    return undefined
  }
  wrappedToast.close = toast.close
  wrappedToast.closeAll = toast.closeAll
  wrappedToast.isActive = toast.isActive
  wrappedToast.update = toast.update
  return wrappedToast
}

export const useErrorToast = () =>
  useIsomerToast({
    ...DEFAULT_TOAST_PROPS,
    description: DEFAULT_ERROR_TOAST_MSG,
    status: "error",
  })

export const useSuccessToast = () =>
  useIsomerToast({
    ...DEFAULT_TOAST_PROPS,
    description: "Success!",
    status: "success",
  })

export const useWarningToast = () =>
  useIsomerToast({
    ...DEFAULT_TOAST_PROPS,
    status: "warning",
  })
