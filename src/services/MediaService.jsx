export class MediaService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  // eslint-disable-next-line class-methods-use-this
  getMediaEndpoint({ siteName, mediaDirectoryName, fileName }) {
    let endpoint = `/sites/${siteName}/media`
    if (mediaDirectoryName) {
      endpoint += `/${mediaDirectoryName}`
    }
    endpoint += `/pages`
    if (fileName) {
      endpoint += `/${fileName}`
    }
    return endpoint
  }

  async create(apiParams, { newFileName, content }) {
    const body = {
      content,
      newFileName,
    }
    return this.apiClient.post(this.getMediaEndpoint(apiParams), body)
  }

  async update(apiParams, { newFileName, sha }) {
    const body = {
      newFileName,
      sha,
    }
    return this.apiClient.post(this.getMediaEndpoint(apiParams), body)
  }

  async get(apiParams) {
    return this.apiClient
      .get(this.getMediaEndpoint(apiParams))
      .then((res) => res.data)
  }

  async delete(apiParams, { sha }) {
    const body = {
      sha,
    }
    return this.apiClient
      .delete(this.getMediaEndpoint(apiParams), { data: body })
      .then((res) => res.data)
  }
}
