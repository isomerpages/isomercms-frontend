export class SettingsService {
  constructor({ apiClient }) {
    this.apiClient = apiClient
  }

  getSettingsEndpoint({ siteName }) {
    return `/sites/${siteName}/settings`
  }

  async update(
    apiParams,
    { configSettings, footerSettings, navigationSettings }
  ) {
    const body = {
      configSettings,
      footerSettings,
      navigationSettings,
    }
    await this.apiClient.post(this.getSettingsEndpoint(apiParams), body)
  }

  async get(apiParams) {
    return await this.apiClient
      .get(this.getSettingsEndpoint(apiParams))
      .then((res) => res.data)
  }
}
