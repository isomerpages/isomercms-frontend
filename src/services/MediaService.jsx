export class MediaService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getMediaEndpoint({ siteName, mediaRoom, mediaDirectoryName, fileName }) {
    let endpoint = `/sites/${siteName}`
    if (mediaRoom) {
      endpoint += `/media/${mediaRoom}/${mediaRoom}`
    }
    if (mediaDirectoryName) {
      endpoint += `${encodeURIComponent(`/${mediaDirectoryName}`)}`
    }
    endpoint += `/files`
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
    return await this.apiClient.post(this.getMediaEndpoint(apiParams), body)
  }

  async update(apiParams, { newFileName, sha }) {
    const body = {
      newFileName,
      sha,
    }
    await this.apiClient.post(this.getMediaEndpoint(apiParams), body)
  }

  async get(apiParams) {
    return await this.apiClient
      .get(this.getMediaEndpoint(apiParams))
      .then((res) => res.data)
  }

  async delete(apiParams, { sha }) {
    const body = {
      sha,
    }
    return await this.apiClient
      .delete(this.getMediaEndpoint(apiParams), { data: body })
      .then((res) => res.data)
  }
}
