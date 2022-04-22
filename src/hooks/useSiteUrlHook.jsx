import axios from "axios"
// Constants
const LOCAL_STORAGE_SITE_URL = "isomercms_site_url"

const useSiteUrlHook = () => {
  const getSiteUrl = (siteName, type) => {
    const siteUrlObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SITE_URL))
    if (siteUrlObj && siteUrlObj[siteName]) return siteUrlObj[siteName][type]
    return null
  }

  const setSiteUrl = (newUrl, siteName, type) => {
    const siteUrlObj =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_SITE_URL)) || {}
    // NOTE: See here for why this verbose syntax should be used over
    // siteUrlObj.hasOwnProperty(siteName)
    // https://eslint.org/docs/rules/no-prototype-builtins
    if (!Object.prototype.hasOwnProperty.call(siteUrlObj, siteName)) {
      siteUrlObj[siteName] = {}
    }
    siteUrlObj[siteName][type] = newUrl
    localStorage.setItem(
      LOCAL_STORAGE_SITE_URL,
      JSON.stringify({ ...siteUrlObj })
    )
  }

  const retrieveUrl = async (siteName, type) => {
    const localStorageSiteUrl = getSiteUrl(siteName, type)
    if (!localStorageSiteUrl) {
      let url
      if (type === "staging") {
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/stagingUrl`
        )
        url = resp.data.stagingUrl
      }
      if (type === "site") {
        const settingsResp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`
        )
        url = settingsResp.data.url
      }
      setSiteUrl(url, siteName, type)
      return url
    }
    return localStorageSiteUrl
  }

  const retrieveStagingUrl = async (siteName) => {
    return retrieveUrl(siteName, "staging")
  }

  const retrieveSiteUrl = async (siteName) => {
    return retrieveUrl(siteName, "site")
  }

  return { retrieveStagingUrl, retrieveSiteUrl }
}

export default useSiteUrlHook
