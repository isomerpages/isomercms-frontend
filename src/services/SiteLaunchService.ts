const whiteListedRepos = process.env.SITE_LAUNCH_FEATURE_WHITELISTED_REPOS?.split(
  ","
)

export const isUserUsingSiteLaunchFeature = (siteName: string): boolean => {
  // The name of our sites for our storybooks is "storybook".
  // Therefore, to allow the storybook to use the site launch feature, we need to
  // explicitly check for it.
  if (siteName === "storybook") {
    return true
  }
  return whiteListedRepos ? whiteListedRepos.includes(siteName) : false
}
