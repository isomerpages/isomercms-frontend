import { rest } from "msw"

import { DirectoryData, PageData } from "types/directory"

export const buildPagesData = (
  mockPagesData: PageData[],
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return rest.get(`*/sites/:siteName/pages`, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockPagesData))
  })
}

export const buildDirData = (
  mockDirData: DirectoryData[],
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return rest.get(`*/sites/:siteName/collections`, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockDirData))
  })
}
