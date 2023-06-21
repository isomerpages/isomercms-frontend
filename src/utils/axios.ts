import { AxiosError } from "axios"

import { ErrorDto, IsomerErrorDto } from "types/error"
import { DEFAULT_RETRY_MSG } from "utils"

export const isAxiosError = (err: unknown): err is AxiosError => {
  return (err as AxiosError).isAxiosError
}

const isBackendError = (
  err: AxiosError<unknown>
): err is AxiosError<ErrorDto> => {
  return !!(err as AxiosError<ErrorDto>).response?.data.message
}

const isV2Error = (
  err: AxiosError<unknown>
): err is AxiosError<IsomerErrorDto> => {
  return !!(err as AxiosError<IsomerErrorDto>).response?.data.error
}

export const getAxiosErrorMessage = (
  error: null | AxiosError<ErrorDto> | AxiosError,
  defaultErrorMessage = DEFAULT_RETRY_MSG
): string => {
  if (!error) return ""

  if (isV2Error(error)) {
    return `${
      error.response?.data.error?.code
        ? `${error.response?.data.error?.code}: `
        : ""
    }${error.response?.data.error?.message || defaultErrorMessage}`
  }

  if (isBackendError(error)) {
    return error.response?.data.message || defaultErrorMessage
  }

  return error.response?.data?.error?.message || defaultErrorMessage
}
