import axios from "axios"
import { useQuery } from "react-query"

import { SITE_COLORS_KEY } from "hooks/queryKeys"

import {
  DEFAULT_ISOMER_PRIMARY_COLOR,
  DEFAULT_ISOMER_SECONDARY_COLOR,
} from "utils/siteColorUtils"
import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

const getSiteColors = async ({ siteName }) => {
  const settingsResp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`
  )
  const { colors } = settingsResp.data

  return {
    primaryColor: colors?.["primary-color"] || DEFAULT_ISOMER_PRIMARY_COLOR,
    secondaryColor:
      colors?.["secondary-color"] || DEFAULT_ISOMER_SECONDARY_COLOR,
  }
}

// eslint-disable-next-line import/prefer-default-export
export function useGetSiteColorsHook({ siteName }, queryParams) {
  const errorToast = useErrorToast()
  return useQuery(
    [SITE_COLORS_KEY, { siteName }],
    () => getSiteColors({ siteName }),
    {
      ...queryParams,
      onError: () => {
        errorToast({
          description: `There was a problem loading the page theme colors. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
