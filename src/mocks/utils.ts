import { DefaultBodyType, rest } from "msw"

import { DirectoryData, PageData } from "types/directory"

const apiDataBuilder = (endpoint: string) => (
  mockData: DefaultBodyType,
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return rest.get(endpoint, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockData))
  })
}

export const buildPagesData = (
  mockPagesData: PageData[],
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return apiDataBuilder("*/sites/:siteName/pages")(mockPagesData, delay)
}

export const buildDirData = (
  mockDirData: DirectoryData[],
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return apiDataBuilder("*/sites/:siteName/collections")(mockDirData, delay)
  return rest.get(`*/sites/:siteName/collections`, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockDirData))
  })
}
