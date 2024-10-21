const GSIB_INDICATOR = "menlo-view.menlosecurity.com"

export const useStagingLink = (link?: string): string | undefined => {
  // NOTE: Prepend the menlo link if this is on GSIB because
  // GSIBs do a security scan that will fail otherwise with a TOO_MANY_REDIRECTS
  // error when we access the raw link directly.
  if (window.name.includes(GSIB_INDICATOR)) {
    return `https://safe.menlosecurity.com/${link}`
  }

  return link
}
