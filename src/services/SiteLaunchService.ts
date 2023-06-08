const whiteListedRepos = process.env.SITE_LAUNCH_FEATURE_WHITELISTED_REPOS?.split(
  ","
)

export const isUserUsingSiteLaunchFeature = (siteName: string): boolean => {
  if (siteName === "storybook") {
    return true
  }
  return whiteListedRepos ? whiteListedRepos.includes(siteName) : false
}
