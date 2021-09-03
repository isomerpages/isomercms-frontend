export class PageService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getPageEndpoint({
    siteName,
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
    fileName,
  }) {
    let endpoint = `/sites/${siteName}`
    if (collectionName) {
      endpoint += `/collections/${collectionName}`
    }
    if (subCollectionName) {
      endpoint += `/subcollections/${encodeURIComponent(subCollectionName)}`
    }
    if (resourceRoomName) {
      endpoint += `/resourceRoom/${resourceRoomName}`
    }
    if (resourceCategoryName) {
      endpoint += `/resources/${resourceCategoryName}`
    }
    endpoint += `/pages`
    if (fileName) {
      endpoint += `/${encodeURIComponent(fileName)}`
    }
    return endpoint
  }

  async create(apiParams, { newFileName, frontMatter }) {
    const body = {
      content: {
        frontMatter,
      },
      newFileName,
    }
    return await this.apiClient.post(this.getPageEndpoint(apiParams), body)
  }

  async update(apiParams, { newFileName, sha, frontMatter, pageBody }) {
    const body = {
      content: {
        pageBody,
        frontMatter,
      },
      newFileName,
      sha,
    }
    await this.apiClient.post(this.getPageEndpoint(apiParams), body)
  }

  async get(apiParams) {
    return await this.apiClient
      .get(this.getPageEndpoint(apiParams))
      .then((res) => res.data)
  }

  async delete(apiParams, { sha }) {
    const body = {
      sha,
    }
    return await this.apiClient
      .delete(this.getPageEndpoint(apiParams), { data: body })
      .then((res) => res.data)
  }
}
