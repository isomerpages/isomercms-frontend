import _ from "lodash"

export class MoverService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  // eslint-disable-next-line class-methods-use-this
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
    const omittedParams = _.omit(apiParams, "siteName")

    if (JSON.stringify(target) === JSON.stringify(omittedParams)) return

    const body = {
      target,
      items,
    }

    // eslint-disable-next-line consistent-return
    return this.apiClient.post(this.getDirectoryEndpoint(apiParams), body)
  }
}
