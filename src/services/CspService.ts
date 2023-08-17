import parse from "content-security-policy-parser"

import { apiService } from "./ApiService"

export const get = async () => {
  const resp = await apiService.get(`/netlify-toml`)
  const { netlifyTomlHeaderValues } = resp.data

  const csp = parse(netlifyTomlHeaderValues["Content-Security-Policy"])
  return csp
}
