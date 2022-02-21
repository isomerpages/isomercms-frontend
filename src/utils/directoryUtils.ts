import { DirectoryType } from "types/directory"

// eslint-disable-next-line import/prefer-default-export
export const getDirectoryType = (
  mediaDirectoryName: string,
  collectionName: string
): DirectoryType => {
  if (mediaDirectoryName) {
    return "mediaDirectoryName"
  }

  if (collectionName) {
    return "subCollectionName"
  }

  return "collectionName"
}
