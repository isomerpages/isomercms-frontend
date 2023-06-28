export const generatePassword = (): string => {
  const PASSWORD_LENGTH = 15
  const randomValues = new Uint32Array(PASSWORD_LENGTH)
  window.crypto.getRandomValues(randomValues)
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
  let result = ""

  for (let i = 0; i < PASSWORD_LENGTH; i += 1) {
    result += characters.charAt(randomValues[i] % characters.length)
  }

  return result
}
