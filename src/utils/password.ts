import generator from "generate-password"

export const generatePassword = (): string => {
  return generator
    .generate({
      length: 15,
      numbers: true,
      symbols: true,
      strict: true,
    })
    .replace(/:/g, "-")
}
