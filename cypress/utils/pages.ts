// NOTE: generates a random string.
// Length is set to 7 by default
export const genRandomString = (length = 7): string => {
  return Math.random().toString(36).substring(length)
}
