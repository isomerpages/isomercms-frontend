export class SettingsService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  // eslint-disable-next-line class-methods-use-this
  getSettingsEndpoint({ siteName }) {
    return `/sites/${siteName}/settings`
  }

  async update(apiParams, { configSettings }) {
    await this.apiClient.post(
      this.getSettingsEndpoint(apiParams),
      configSettings
    )
  }

  async get(apiParams) {
    return this.apiClient
      .get(this.getSettingsEndpoint(apiParams))
      .then((res) => res.data)
  }
}
