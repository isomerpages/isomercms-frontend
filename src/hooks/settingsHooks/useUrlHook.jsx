import axios from "axios"
import { useQuery } from "react-query"

import { SITE_URL_KEY, STAGING_URL_KEY } from "constants/queryKeys"

const getStagingUrl = async (siteName) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/stagingUrl`
  )
  return resp.data.stagingUrl
}

const getSiteUrl = async (siteName) => {
  const settingsResp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`
  )
  return settingsResp.data.settings.configFieldsRequired.url
}

export function useSiteUrlHook({ siteName }) {
  return useQuery([SITE_URL_KEY, { siteName }], () => getSiteUrl(siteName), {
    initialData: `https://${siteName}.gov.sg`,
  })
}

export function useStagingUrl({ siteName }) {
  return useQuery(
    [STAGING_URL_KEY, { siteName }],
    () => getStagingUrl(siteName),
    {
      initialData: `https://${siteName}.netlify.app`,
    }
  )
}
