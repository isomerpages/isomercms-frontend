import { GrowthBook } from "@growthbook/growthbook-react"

const GROWTHBOOK_API_HOST = "https://cdn.growthbook.io"

export const getGrowthBookInstance = (clientKey: string) => {
  const isDev = process.env.REACT_APP_ENV === "LOCAL_DEV" // only enable for local dev

  return new GrowthBook({
    apiHost: GROWTHBOOK_API_HOST,
    clientKey,
    enableDevMode: isDev, // enable only for local dev
  })
}

export const getSiteNameAttributeFromPath = (path: string) => {
  const pathnames = path.split("/")

  if (pathnames.length > 2 && pathnames[1] === "sites") {
    return pathnames[2]
  }
  return ""
}
