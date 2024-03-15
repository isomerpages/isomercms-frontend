import { APIRequestContext, request } from "@playwright/test"

export const getApi = async (
  storageState: Parameters<typeof request.newContext>[0]["storageState"]
): Promise<APIRequestContext> => {
  const req = await request.newContext({
    baseURL: process.env.CYPRESS_BACKEND_URL,
    storageState,
  })

  return req
}
