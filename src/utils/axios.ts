import { AxiosError } from "axios"

import { DEFAULT_RETRY_MSG } from "utils"

export const isAxiosError = (err: unknown): err is AxiosError => {
  return (err as AxiosError).isAxiosError
}

export const getAxiosErrorMessage = (error: null | AxiosError): string => {
  if (!error) return ""
  return error?.response?.data?.error?.message || DEFAULT_RETRY_MSG
}
