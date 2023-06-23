import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto"

import generator from "generate-password"

const ALGORITHM = "aes-256-cbc"
const { REACT_APP_PASSWORD_SECRET_KEY } = process.env

function generateEncryptionKey() {
  const a = randomBytes(32)
  const derivedKey = createHash("sha256").update(a).digest()
  return derivedKey
}

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

export const encryptPassword = (
  password: string
): {
  encryptedPassword: string
  iv: string
} => {
  if (!REACT_APP_PASSWORD_SECRET_KEY) throw new Error()
  const SECRET_KEY = Buffer.from(REACT_APP_PASSWORD_SECRET_KEY, "hex")
  const iv = randomBytes(16)
  const decipher = createCipheriv(ALGORITHM, SECRET_KEY, iv)
  let encryptedPassword = decipher.update(password, "utf8", "hex")
  encryptedPassword += decipher.final("hex")
  return { encryptedPassword, iv: iv.toString("hex") }
}

export const decryptPassword = (
  encryptedPassword: string,
  iv: string
): string => {
  if (!REACT_APP_PASSWORD_SECRET_KEY) throw new Error()
  const SECRET_KEY = Buffer.from(REACT_APP_PASSWORD_SECRET_KEY, "hex")
  const decipher = createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "hex")
  )
  let decrypted = decipher.update(encryptedPassword, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
