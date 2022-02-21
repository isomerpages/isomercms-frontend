import { DirectoryType } from "types/directory"

const getDirectoryType = (
  mediaDirectoryName: string,
  collectionName: string,
  isCreation = true
): DirectoryType => {
  if (mediaDirectoryName) {
    return "mediaDirectoryName"
  }

  // NOTE: If we are creating a directory and there is a collection name,
  // this implies that we are creating a subdirectory.
  if (isCreation) {
    return collectionName ? "subCollectionName" : "collectionName"
  }

  return collectionName ? "collectionName" : "subCollectionName"
}

// The below 2 utility functions are re-exported to hide the isCreation parameter
export const getDirectoryCreationType = (
  mediaDirectoryName: string,
  collectionName: string
): DirectoryType => {
  return getDirectoryType(mediaDirectoryName, collectionName)
}

export const getDirectorySettingsType = (
  mediaDirectoryName: string,
  collectionName: string
): DirectoryType => {
  return getDirectoryType(mediaDirectoryName, collectionName, false)
}
