import _ from "lodash"

export const SPECIAL_PAGES = ["homepage", "navbar", "contact-us"]

export const isEditPageUrl = (url: string): boolean => {
  // NOTE: Lowercase here because `/editpage` also works
  return url.toLowerCase().includes("/editpage") && url.endsWith(".md")
}

export const isSpecialPagesUrl = (url: string): boolean => {
  return _.some(SPECIAL_PAGES, (page) => url.toLowerCase().includes(page))
}
