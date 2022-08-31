/**
 * Converts a date/time string retrieved from Github to human readable string representing time difference.
 * e.g. 2022-08-24T08:30:46Z to Updated today
 */
export const convertUtcToTimeDiff = (lastUpdatedTime: string): string => {
  const gapInUpdate = new Date().getTime() - new Date(lastUpdatedTime).getTime()
  const numDaysAgo = Math.floor(gapInUpdate / (1000 * 60 * 60 * 24))
  // return a message for number of days ago repo was last updated
  switch (numDaysAgo) {
    case 0:
      return "Updated today"
    case 1:
      return "Updated 1 day ago"
    default:
      return `Updated ${numDaysAgo} days ago`
  }
}
