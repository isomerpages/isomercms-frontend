import { DirectoryData, PageData, ResourcePageData } from "types/directory"

export const isDirectoryData = (
  possibleDir: unknown
): possibleDir is DirectoryData => {
  return !!(possibleDir as DirectoryData).name
}

export const isPageData = (possiblePage: unknown): possiblePage is PageData => {
  const hasPermissibleResourceType =
    (possiblePage as PageData).resourceType === "file" ||
    (possiblePage as PageData).resourceType === "post" ||
    !(possiblePage as PageData).resourceType

  return !!(possiblePage as PageData).name && hasPermissibleResourceType
}

export const isResourcePageData = (
  possiblePage: unknown
): possiblePage is ResourcePageData => {
  return isPageData(possiblePage) && possiblePage.date !== undefined
}
