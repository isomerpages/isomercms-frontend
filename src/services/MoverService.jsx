export class MoverService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getDirectoryEndpoint({
    siteName,
    resourceRoomName,
    resourceCategoryName,
    collectionName,
    subCollectionName,
    mediaRoom,
    mediaDirectoryName,
  }) {
    let endpoint = `/sites/${siteName}`
    if (mediaDirectoryName) {
      endpoint += `/media/${mediaDirectoryName}`
    }
    if (resourceRoomName) {
      endpoint += `/resourceRoom/${resourceRoomName}`
    }
    if (resourceCategoryName) {
      endpoint += `/resources/${resourceCategoryName}`
    }
    if (collectionName) {
      endpoint += `/collections/${collectionName}`
    }
    if (subCollectionName) {
      endpoint += `/subcollections/${subCollectionName}`
    }
    if (
      !collectionName &&
      !subCollectionName &&
      !resourceCategoryName &&
      !resourceRoomName &&
      !mediaRoom &&
      !mediaDirectoryName
    ) {
      endpoint += `/pages`
    }
    endpoint += `/move`
    return endpoint
  }

  async move(apiParams, { target, items }) {
    if (
      JSON.stringify(target) ===
      JSON.stringify((({ siteName, ...p }) => p)(apiParams))
    )
      return
    const body = {
      target,
      items,
    }
    return await this.apiClient.post(this.getDirectoryEndpoint(apiParams), body)
  }
}
