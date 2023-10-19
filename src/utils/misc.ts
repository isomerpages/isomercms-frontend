/**
 * Util method for determining if a particular URL link is a relative link that
 * should point to a resource on the same site.
 */
export const isLinkInternal = (url: string) => {
  const tempLink = document.createElement("a")
  tempLink.href = url
  return tempLink.hostname === window.location.hostname
}
