import { DefaultBodyType, rest } from "msw"

import {
  DirectoryData,
  PageData,
  ResourcePageData,
  MediaData,
} from "types/directory"
import { BackendSiteSettings } from "types/settings"
import {
  CollaboratorsStats,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/sitedashboard"
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

export const buildResourceRoomName = apiDataBuilder<{
  resourceRoomName: string
}>("*/sites/:siteName/resourceRoom")

export const buildResourceRoomData = apiDataBuilder<DirectoryData[]>(
  "*/sites/:siteName/resourceRoom/:resourceRoomName"
)

export const buildSettingsData = apiDataBuilder<BackendSiteSettings>(
  "*/sites/:siteName/settings"
)

export const buildSiteDashboardReviewRequests = apiDataBuilder<
  SiteDashboardReviewRequest[]
>("/sites/:siteName/review/summary")

// TODO: To be replaced with collaborators PR
export const buildSiteDashboardCollaboratorsStatistics = apiDataBuilder<CollaboratorsStats>(
  "*/sites/:siteName/collaborators/statistics"
)

export const buildSiteDashboardInfo = apiDataBuilder<SiteDashboardInfo>(
  "/sites/:siteName/info"
)

export const buildFolderData = apiDataBuilder<(PageData | DirectoryData)[]>(
  "*/sites/:siteName/collections/:collectionName"
)

export const buildSubfolderData = apiDataBuilder<(PageData | DirectoryData)[]>(
  "*/sites/:siteName/collections/:collectionName/subcollections/:subCollectionName"
)

export const buildLoginData = apiDataBuilder<LoggedInUser>("*/auth/whoami")

export const buildLastUpdated = apiDataBuilder<{ lastUpdated: string }>(
  "*/sites/:siteName/lastUpdated"
)

export const buildResourceCategoryData = apiDataBuilder<ResourcePageData[]>(
  "*/sites/:siteName/resourceRoom/:resourceRoomName/resources/:resourceCategoryName"
)

export const buildMediaData = apiDataBuilder<(MediaData | DirectoryData)[]>(
  "*/sites/:siteName/media/:mediaDirectoryName"
)
