export class ConfigService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getEndpoint({ siteName, isHomepage, isSettings }) {
    if (isHomepage) return `/sites/${siteName}/homepage`
    if (isSettings) return `/sites/${siteName}/settings`
  }

  async update(apiParams, { configConfig }) {
    await this.apiClient.post(this.getEndpoint(apiParams), configConfig)
  }

  async get(apiParams) {
    return await this.apiClient
      .get(this.getEndpoint(apiParams))
      .then((res) => res.data)
  }
}
