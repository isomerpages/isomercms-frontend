import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as ContactService from "services/ContactService"

import { VerifyOtpParams } from "types/contact"

export const useVerifyContact = (): UseMutationResult<
  void,
  AxiosError,
  VerifyOtpParams
> => {
  return useMutation<void, AxiosError, VerifyOtpParams>((body) =>
    ContactService.verifyContactOtp(body)
  )
}
