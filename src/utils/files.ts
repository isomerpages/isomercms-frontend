import _ from "lodash"

const DECIMAL_BYTE_UNITS = ["B", "kB", "MB", "GB", "TB"]

export const getFileExt = (mediaUrl: string): string | undefined => {
  // NOTE: If it starts with data, the image is within a private repo.
  // Hence, we will extract the portion after the specifier
  // till the terminating semi-colon for use as the extension
  if (mediaUrl.startsWith("data:image/")) {
    return _.takeWhile(mediaUrl.slice(11), (char) => char !== ";").join("")
  }

  // Otherwise, this will point to a publicly accessible github url
  return mediaUrl.split(".").pop()?.split("?").shift()
}

/**
 * @precondition this function must only be called on a qualified filename.
 * Ie, calling this function on a `data:...` is invalid and the function will return
 * erroneous info.
 *
 * This function also assumes that the file is not nested within any directory
 * @param name the qualified filename of the data
 * @returns
 */
export const getFileName = (name: string): string => {
  return name.split(".").slice(0, -1).join(".")
}

/**
 * Converts the given file size in bytes to a human readable string.
 *
 * @example 1100000 -> "1.1 MB"
 * @param fileSizeInBytes the size of the file in bytes to be converted to a readable string
 * @returns the human-readable file size string
 */
export const getReadableFileSize = (fileSizeInBytes: number): string => {
  const i = Math.floor(Math.log(fileSizeInBytes) / Math.log(1000))
  const size = Number((fileSizeInBytes / 1000 ** i).toFixed(2))
  return `${size} ${DECIMAL_BYTE_UNITS[i]}`
}

/**
 * Counterpart to getReadableFileSize
 * Converts the given human readable file size string to the corresponding file size in bytes.
 * @example "1.1 MB" -> 1100000
 * @param readableFileSize the human readable file size string to be converted to bytes
 * @returns the file size in bytes
 */
export const getByteFileSize = (readableFileSize: string): number => {
  const [size, unit] = readableFileSize.split(" ")
  const unitIndex = DECIMAL_BYTE_UNITS.indexOf(unit)
  return Number(size) * 1000 ** unitIndex
}
