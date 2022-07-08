import { PageData } from "types/directory"

export const isPageData = (possiblePage: unknown): possiblePage is PageData => {
  const hasPermissibleResourceType =
    (possiblePage as PageData).resourceType === "file" ||
    (possiblePage as PageData).resourceType === "post" ||
    !(possiblePage as PageData).resourceType

  return !!(possiblePage as PageData).name && hasPermissibleResourceType
}
