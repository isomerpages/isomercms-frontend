import { WHITELISTED_REPOS } from "constants/siteLaunch"

const isRepoWhitelistedForSiteLaunch = (siteName: string): boolean => {
  // The name of our sites for our storybooks is "storybook".
  // Therefore, to allow the storybook to use the site launch feature, we need to
  // explicitly check for it.
  if (siteName === "storybook") {
    return true
  }
  return WHITELISTED_REPOS ? WHITELISTED_REPOS.includes(siteName) : false
}

const isAdminUser = (email: string): boolean => {
  return email.endsWith(".gov.sg")
}

export const isSiteLaunchEnabled = (
  siteName: string,
  email: string
): boolean => {
  return isRepoWhitelistedForSiteLaunch(siteName) && isAdminUser(email)
}
