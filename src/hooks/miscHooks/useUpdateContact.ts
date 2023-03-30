import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as ContactService from "services/ContactService"

import { ContactParams } from "types/contact"

export const useUpdateContact = (): UseMutationResult<
  void,
  AxiosError,
  ContactParams
> => {
  return useMutation<void, AxiosError, ContactParams>((body) =>
    ContactService.sendContactOtp(body)
  )
}
