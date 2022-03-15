export class ConfigService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getEndpoint({ siteName, configEndpoint }) {
    if (configEndpoint) return `/sites/${siteName}/${configEndpoint}`
  }

  async update(apiParams, config) {
    await this.apiClient.post(this.getEndpoint(apiParams), config)
  }

  async get(apiParams) {
    return this.apiClient
      .get(this.getEndpoint(apiParams))
      .then((res) => res.data)
  }
}
