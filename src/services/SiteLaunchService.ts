export const isUserUsingSiteLaunchFeature = (siteName: string): boolean => {
  // whitelisting sites that we want to trial this feature with
  const whiteListedRepos = process.env.SITE_LAUNCH_FEATURE_WHITELISTED_REPOS?.split(
    ","
  )
  return whiteListedRepos ? whiteListedRepos.includes(siteName) : false
}
