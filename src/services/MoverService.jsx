export class MoverService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getDirectoryEndpoint({ siteName, collectionName, subCollectionName }) {
    let endpoint = `/sites/${siteName}`
    if (collectionName) {
      endpoint += `/collections/${collectionName}`
    }
    if (subCollectionName) {
      endpoint += `/subcollections/${encodeURIComponent(subCollectionName)}`
    }
    if (!collectionName && !subcollectionName) {
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
