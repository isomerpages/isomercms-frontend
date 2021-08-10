import axios from "axios"
import { useQuery } from "react-query"

import { errorToast } from "../../utils/toasts"
import { SITE_COLORS_KEY } from "../queryKeys"

import {
  DEFAULT_ISOMER_PRIMARY_COLOR,
  DEFAULT_ISOMER_SECONDARY_COLOR,
} from "../../utils/siteColorUtils"

const getSiteColors = async ({ siteName }) => {
  const settingsResp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`
  )
  const { settings } = settingsResp.data
  const {
    configFieldsRequired: { colors },
  } = settings

  return {
    primaryColor: colors?.["primary-color"] || DEFAULT_ISOMER_PRIMARY_COLOR,
    secondaryColor:
      colors?.["secondary-color"] || DEFAULT_ISOMER_SECONDARY_COLOR,
  }
}

export function useSiteColorsHook({ siteName }, queryParams) {
  return useQuery(
    [SITE_COLORS_KEY, { siteName }],
    () => getSiteColors({ siteName }),
    {
      ...queryParams,
      onError: () =>
        errorToast(
          `There was a problem loading the page theme colors. ${DEFAULT_RETRY_MSG}`
        ),
    }
  )
}
