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

const isIsomerExternalError = (
  err: AxiosError<unknown>
): err is AxiosError<IsomerErrorDto> => {
  const errDto = err as AxiosError<IsomerErrorDto>
  return (
    !!errDto.response?.data.error &&
    errDto.response?.data.error.isV2Error &&
    !!errDto.response.data.error.code &&
    !!errDto.response.data.error.message
  )
}

export const getAxiosErrorMessage = (
  error: null | AxiosError<ErrorDto> | AxiosError,
  defaultErrorMessage = DEFAULT_RETRY_MSG
): string => {
  if (!error) return ""

  if (isIsomerExternalError(error)) {
    return `${error.response?.data.error?.code}: ${error.response?.data.error?.message}`
  }

  if (isBackendError(error)) {
    return error.response?.data.message || defaultErrorMessage
  }

  return error.response?.data?.error?.message || defaultErrorMessage
}
