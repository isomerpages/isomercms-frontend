interface DirectoryCreationOptions {
  isCreate?: boolean
  isReorder?: boolean
}

// R all Collections
// GET /sites/a-test-v4/collections
// C Collections
// POST /sites/a-test-v4/collections
// RUD Collections
// /sites/a-test-v4/collections/:collectionName
// C subCollections
// POST /sites/a-test-v4/collections/:collectionName/subCollection
// RUD subCollections
// /sites/a-test-v4/collections/:collectionName/subCollection/:subCollection
// Reorder
// /sites/a-test-v4/collections/:collectionName/reorder
// /sites/a-test-v4/collections/:collectionName/subCollection/:subCollection/reorder
export const getCollectionEndpoint = (
  siteName: string,
  collectionName?: string,
  subCollectionName?: string,
  options?: DirectoryCreationOptions
): string => {
  let endpoint = `/sites/${siteName}/collections`
  if (collectionName) {
    endpoint += `/${collectionName}`
  }
  if (collectionName && options?.isCreate) {
    endpoint += `/subcollections`
  }
  if (subCollectionName) {
    endpoint += `/subcollections/${subCollectionName}`
  }
  if (options?.isReorder) {
    endpoint += `/reorder`
  }
  return endpoint
}

// R media room (images)
// GET /sites/a-test-v4/media/images
// R media room (images folder)
// GET /sites/a-test-v4/media/images%2F:directoryName
// C media folder
// POST /sites/a-test-v4/media
// Rename media folder
// POST /sites/a-test-v4/media/images%2F:directoryName
// D media folder
// DELETE /sites/a-test-v4/media/images%2F:directoryName
export const getMediaDirectoryEndpoint = (
  siteName: string,
  mediaDirectoryName: string,
  isCreate: DirectoryCreationOptions["isCreate"]
): string => {
  const endpoint = `/sites/${siteName}/media`
  return isCreate ? endpoint : `${endpoint}/${mediaDirectoryName}`
}

export const getPagesEndpoint = (siteName: string): string =>
  `/sites/${siteName}/pages`

// C resource room
// POST /sites/a-test-v4/resourceRoom
// RUD resource room
// /sites/a-test-v4/resourceRoom/:resourceRoomName
// C resource category
// POST /sites/a-test-v4/resourceRoom/:resourceRoomName/resourceCategory
// RUD resource category
// POST /sites/a-test-v4/resourceRoom/:resourceRoomName/resourceCategory/:resourcesName
export const getResourcesEndpoint = (
  siteName: string,
  resourceRoomName?: string,
  resourceCategoryName?: string,
  isCreate?: DirectoryCreationOptions["isCreate"]
): string => {
  let endpoint = `/sites/${siteName}/resourceRoom`

  if (resourceRoomName) {
    endpoint += `/${resourceRoomName}`
  }
  if (resourceRoomName && isCreate) {
    endpoint += `/resources`
  }
  if (resourceCategoryName) {
    endpoint += `/resources/${resourceCategoryName}`
  }
  return endpoint
}
