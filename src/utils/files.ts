import _ from "lodash"

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
export const getFileName = (name: string): string | undefined => {
  return name.split(".").at(0)
}
