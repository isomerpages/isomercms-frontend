import { WHITELISTED_REPOS } from "constants/siteLaunch"

import { SiteMemberRole } from "types/collaborators"

const isRepoWhitelistedForSiteLaunch = (siteName: string): boolean => {
  // The name of our sites for our storybooks is "storybook".
  // Therefore, to allow the storybook to use the site launch feature, we need to
  // explicitly check for it.
  if (siteName === "storybook") {
    return true
  }
  return WHITELISTED_REPOS ? WHITELISTED_REPOS.includes(siteName) : false
}

const isAdminUser = (role?: SiteMemberRole): boolean => {
  return role === `ADMIN`
}

export const isSiteLaunchEnabled = (
  siteName: string,
  role?: SiteMemberRole
): boolean => {
  return isRepoWhitelistedForSiteLaunch(siteName) && isAdminUser(role)
}
