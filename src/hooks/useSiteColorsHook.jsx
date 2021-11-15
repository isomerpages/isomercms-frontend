// Utils
import {
  defaultSiteColors,
  getSiteColors,
  createPageStyleSheet,
} from "utils/siteColorUtils"

// Constants
const LOCAL_STORAGE_SITE_COLORS = "isomercms_colors"

const useSiteColorsHook = () => {
  const getLocalStorageSiteColors = () => {
    const localStorageSiteColors = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_SITE_COLORS)
    )
    return localStorageSiteColors
  }

  const setLocalStorageSiteColors = (newSiteColors) => {
    localStorage.setItem(
      LOCAL_STORAGE_SITE_COLORS,
      JSON.stringify(newSiteColors)
    )
  }

  const retrieveSiteColors = async (siteName) => {
    const siteColors = getLocalStorageSiteColors()
    // if (!siteColors[siteName]) {
    if (!siteColors || !siteColors[siteName]) {
      const { primaryColor, secondaryColor } = await getSiteColors(siteName)

      setLocalStorageSiteColors({
        ...siteColors,
        [siteName]: {
          primaryColor,
          secondaryColor,
        },
      })
    }
  }

  const generatePageStyleSheet = (siteName) => {
    const siteColors = getLocalStorageSiteColors()

    let { primaryColor } = defaultSiteColors.default
    let { secondaryColor } = defaultSiteColors.default

    if (siteColors[siteName]) {
      const {
        primaryColor: sitePrimaryColor,
        secondaryColor: siteSecondaryColor,
      } = siteColors[siteName]
      primaryColor = sitePrimaryColor
      secondaryColor = siteSecondaryColor
    }

    createPageStyleSheet(siteName, primaryColor, secondaryColor)
  }

  return {
    retrieveSiteColors,
    generatePageStyleSheet,
  }
}

export default useSiteColorsHook
