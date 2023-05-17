import { AxiosError } from "axios"
import { UseQueryResult, useQuery } from "react-query"

import { GET_CONTACT_US_KEY } from "constants/queryKeys"

import { ContactUsService } from "services"
import { ContactUsDto } from "types/contactUs"
import { useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useGetContactUsHook = (
  siteName: string
): UseQueryResult<ContactUsDto> => {
  const errorToast = useErrorToast()
  return useQuery(
    [GET_CONTACT_US_KEY, siteName],
    () => ContactUsService.getContactUs(siteName),
    {
      onError: (err: AxiosError) => {
        errorToast({
          description: `Your Contact Us page details could not be retrieved. ${DEFAULT_RETRY_MSG}. Error: ${err.message}`,
        })
      },
    }
  )
}
