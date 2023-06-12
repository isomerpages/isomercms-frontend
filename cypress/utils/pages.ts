// NOTE: generates a random string of length 7
export const genRandomString = (): string => {
  return Math.random().toString(36).substring(7)
}
