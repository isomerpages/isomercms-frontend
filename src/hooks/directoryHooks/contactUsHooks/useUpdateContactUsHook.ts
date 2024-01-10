import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import { GET_CONTACT_US_KEY } from "constants/queryKeys"

import { getAxiosErrorMessage } from "utils/axios"

import { ContactUsService } from "services"
import { ContactUsFrontMatter } from "types/contactUs"
import { useSuccessToast, useErrorToast, DEFAULT_RETRY_MSG } from "utils"

interface UpdateContactUsParams {
  frontMatter: ContactUsFrontMatter
  sha: string
}

export const useUpdateContactUsHook = (
  siteName: string
): UseMutationResult<void, AxiosError, UpdateContactUsParams> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (contactUsData: UpdateContactUsParams) => {
      const { frontMatter, sha } = contactUsData
      return ContactUsService.updateContactUs(siteName, {
        content: {
          frontMatter,
          pageBody: "",
        },
        sha,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_CONTACT_US_KEY, siteName])
        successToast({
          id: "update-homepage-success",
          description: "Contact Us page updated successfully",
        })
      },
      onError: (err) => {
        errorToast({
          id: "update-homepage-error",
          description: `Could not update Contact Us page. ${DEFAULT_RETRY_MSG}. Error: ${getAxiosErrorMessage(
            err
          )}`,
        })
      },
    }
  )
}
