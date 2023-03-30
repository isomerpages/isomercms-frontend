interface DisplayedDateTime {
  date: string
  time: string
}

export const getDateTimeFromUnixTime = (
  unixTime: number
): DisplayedDateTime => {
  const date = new Date(unixTime)
  return {
    date: date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      timeStyle: "short",
    }),
  }
}
