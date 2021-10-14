export class DirectoryService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getDirectoryEndpoint({
    siteName,
    collectionName,
    subCollectionName,
    isCreate,
    isReorder,
    isUnlinked,
  }) {
    // R Unlinked pages
    // /sites/a-test-v4/pages

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

    if (isUnlinked) return `/sites/${siteName}/pages`

    let endpoint = `/sites/${siteName}/collections`
    if (collectionName) {
      endpoint += `/${collectionName}`
    }
    if (collectionName && isCreate) {
      endpoint += `/subcollections`
    }
    if (subCollectionName) {
      endpoint += `/subcollections/${subCollectionName}`
    }
    if (isReorder) {
      endpoint += `/reorder`
    }
    return endpoint
  }

  async create(apiParams, { newDirectoryName, items }) {
    const body = {
      items,
      newDirectoryName,
    }
    return await this.apiClient.post(this.getDirectoryEndpoint(apiParams), body)
  }

  async update(apiParams, { newDirectoryName }) {
    const body = {
      newDirectoryName,
    }
    await this.apiClient.post(this.getDirectoryEndpoint(apiParams), body)
  }

  async reorder(apiParams, { items }) {
    const body = {
      items,
    }
    await this.apiClient.post(
      this.getDirectoryEndpoint({ ...apiParams, isReorder: true }),
      body
    )
  }

  async get(apiParams) {
    return await this.apiClient
      .get(this.getDirectoryEndpoint(apiParams))
      .then((res) => res.data)
  }

  async delete(apiParams) {
    return await this.apiClient
      .delete(this.getDirectoryEndpoint(apiParams))
      .then((res) => res.data)
  }
}
