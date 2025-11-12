/**
 * Util method for determining if a particular URL link is a relative link that
 * should point to a resource on the same site.
 */
export const isLinkInternal = (url: string) => {
  const tempLink = document.createElement("a")
  tempLink.href = url
  return tempLink.hostname === window.location.hostname
}

// Util method to check if a URL path is safe (i.e. does not contain any
// directory traversal patterns like '..\' or '\..', etc).
export const isSafePath = (path: string): boolean => {
  const unsafePattern = /(\\\.\.|\.\.\\)/
  return !unsafePattern.test(path)
}
