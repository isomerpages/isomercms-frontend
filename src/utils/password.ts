import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "crypto"

const ALGORITHM = "aes-256-cbc"
const { REACT_APP_PASSWORD_SECRET_KEY } = process.env
if (!REACT_APP_PASSWORD_SECRET_KEY) throw new Error()
const SECRET_KEY = Buffer.from(REACT_APP_PASSWORD_SECRET_KEY, "hex")

function generateEncryptionKey() {
  const a = randomBytes(32)
  const derivedKey = createHash("sha256").update(a).digest()
  return derivedKey
}

export const generatePassword = (): string => {
  return randomBytes(16)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "!")
    .replace(/\=/g, "")
}

export const encryptPassword = (
  password: string
): {
  encryptedPassword: string
  iv: string
} => {
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
  const decipher = createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "hex")
  )
  let decrypted = decipher.update(encryptedPassword, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
