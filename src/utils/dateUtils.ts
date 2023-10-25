import { formatDuration, intervalToDuration } from "date-fns"

/**
 * Converts a date/time string retrieved from Github to human readable string representing time difference.
 * e.g. 2022-08-24T08:30:46Z to Updated today
 */
export const convertUtcToTimeDiff = (timestamp: string | number): string => {
  const gapInUpdate = new Date().getTime() - new Date(timestamp).getTime()
  const numDaysAgo = Math.floor(gapInUpdate / (1000 * 60 * 60 * 24))

  if (gapInUpdate < 1000 * 60) {
    // Threshold for "just now" is 1 minute
    return "just now"
  }
  if (numDaysAgo === 0) {
    return "today"
  }
  if (numDaysAgo === 1) {
    return "yesterday"
  }
  if (numDaysAgo >= 365) {
    return "more than a year ago"
  }
  return `${numDaysAgo} days ago`
}

/**
 * Converts a date/time string retrieved from our database to human readable string representing time difference.
 * Used to retrieve short form of time difference, e.g. 2wk, 1mo
 */
export const convertDateToTimeDiff = (date: string): string => {
  const timeTruncationMap = {
    years: "yr",
    year: "yr",
    months: "mo",
    month: "mo",
    weeks: "wk",
    week: "wk",
    days: "d",
    day: "d",
    hours: "h",
    hour: "h",
    minute: "m",
    minutes: "m",
  }
  const timeDiff = intervalToDuration({
    start: new Date(date),
    end: new Date(),
  })
  const durationStr = formatDuration(timeDiff, {
    format: ["years", "months", "weeks", "days", "hours", "minutes"],
    delimiter: ",",
  })

  const mostSignificantTime = durationStr.split(",")[0] // e.g. 3 months

  if (!mostSignificantTime) return "0m"
  const timePeriod = mostSignificantTime.split(" ")[1]
  return `${mostSignificantTime.split(" ")[0]}${
    timeTruncationMap[timePeriod as keyof typeof timeTruncationMap]
  }`
}
