import { DirectoryType } from "types/directory"

const getDirectoryType = (
  mediaDirectoryName: string,
  collectionName: string,
  subcollectionName: string,
  isCreation = true
): DirectoryType => {
  if (mediaDirectoryName) {
    return "mediaDirectoryName"
  }

  // NOTE: Subcollections are created from the collections screen,
  // so if there is a collection name, this implies that we are creating a subdirectory.
  if (isCreation) {
    return collectionName ? "subCollectionName" : "collectionName"
  }

  // Otherwise, we look for subCollectionName to determine
  // if we are renaming a collection or subcollection.
  return subcollectionName ? "subCollectionName" : "collectionName"
}

// The below 2 utility functions are re-exported to hide the isCreation parameter
/**
 * Returns the type of directory being created. If mediaDirectoryName is specified, returns "mediaDirectoryName",
 * otherwise, the presence of collectionName indicates that a subcollection is being created.
 * @param mediaDirectoryName
 * @param collectionName
 * @returns
 */
export const getDirectoryCreationType = (
  mediaDirectoryName: string,
  collectionName: string
): DirectoryType => {
  return getDirectoryType(mediaDirectoryName, collectionName, "")
}

/**
 * Returns the type of directory being modified. If mediaDirectoryName is specified, returns "mediaDirectoryName",
 * otherwise, the presence of subcollectionName indicates that a subcollection is being modified.
 * @param mediaDirectoryName
 * @param subcollectionName
 * @returns
 */
export const getDirectorySettingsType = (
  mediaDirectoryName: string,
  subcollectionName: string
): DirectoryType => {
  return getDirectoryType(mediaDirectoryName, "", subcollectionName, false)
}
