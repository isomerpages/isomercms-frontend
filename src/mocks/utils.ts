import { DefaultBodyType, rest } from "msw"

import { DirectoryData, PageData } from "types/directory"
import { LoggedInUser } from "types/user"

const apiDataBuilder = <T extends DefaultBodyType = DefaultBodyType>(
  endpoint: string
) => (
  mockData: T,
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> => {
  return rest.get(endpoint, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockData))
  })
}

export const buildPagesData = apiDataBuilder<PageData[]>(
  "*/sites/:siteName/pages"
)

export const buildDirData = apiDataBuilder<DirectoryData[]>(
  "*/sites/:siteName/collections"
)

export const buildFolderData = apiDataBuilder<(PageData | DirectoryData)[]>(
  "*/sites/:siteName/collections/:collectionName"
)

export const buildLoginData = apiDataBuilder<LoggedInUser>("*/auth/whoami")

export const buildLastUpdated = apiDataBuilder<{ lastUpdated: string }>(
  "*/sites/:siteName/lastUpdated"
)
