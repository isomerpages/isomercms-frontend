import { DefaultBodyType, rest } from "msw"

import { CollaboratorData, CollaboratorRoleData } from "types/collaborators"
import {
  MediaData,
  DirectoryData,
  PageData,
  ResourcePageData,
} from "types/directory"
import { NotificationData } from "types/notifications"
import { BackendSiteSettings } from "types/settings"
import {
  CollaboratorsStats,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"
import { LoggedInUser } from "types/user"

const apiDataBuilder = <T extends DefaultBodyType = DefaultBodyType>(
  endpoint: string,
  requestType: "get" | "post" | "delete"
) => (
  mockData: T,
  delay?: number | "infinite"
): ReturnType<typeof rest["get"] | typeof rest["post"]> => {
  return rest[requestType](endpoint, (req, res, ctx) => {
    return res(delay ? ctx.delay(delay) : ctx.delay(0), ctx.json(mockData))
  })
}

export const buildPagesData = apiDataBuilder<PageData[]>(
  "*/sites/:siteName/pages",
  "get"
)

export const buildDirData = apiDataBuilder<DirectoryData[]>(
  "*/sites/:siteName/collections",
  "get"
)

export const buildResourceRoomName = apiDataBuilder<{
  resourceRoomName: string
}>("*/sites/:siteName/resourceRoom", "get")

export const buildResourceRoomData = apiDataBuilder<DirectoryData[]>(
  "*/sites/:siteName/resourceRoom/:resourceRoomName",
  "get"
)

export const buildSettingsData = apiDataBuilder<BackendSiteSettings>(
  "*/sites/:siteName/settings",
  "get"
)

export const buildSiteDashboardReviewRequests = apiDataBuilder<
  SiteDashboardReviewRequest[]
>("*/sites/:siteName/review/summary", "get")

// TODO: To be replaced with collaborators PR
export const buildSiteDashboardCollaboratorsStatistics = apiDataBuilder<CollaboratorsStats>(
  "*/sites/:siteName/collaborators/statistics",
  "get"
)

export const buildSiteDashboardInfo = apiDataBuilder<SiteDashboardInfo>(
  "*/sites/:siteName/info",
  "get"
)

export const buildFolderData = apiDataBuilder<(PageData | DirectoryData)[]>(
  "*/sites/:siteName/collections/:collectionName",
  "get"
)

export const buildSubfolderData = apiDataBuilder<(PageData | DirectoryData)[]>(
  "*/sites/:siteName/collections/:collectionName/subcollections/:subCollectionName",
  "get"
)

export const buildLoginData = apiDataBuilder<LoggedInUser>(
  "*/auth/whoami",
  "get"
)
export const buildCollaboratorRoleData = apiDataBuilder<CollaboratorRoleData>(
  "*/sites/:siteName/collaborators/role",
  "get"
)

export const buildCollaboratorData = apiDataBuilder<CollaboratorData>(
  "*/sites/:siteName/collaborators",
  "get"
)

export const buildLastUpdated = apiDataBuilder<{ lastUpdated: string }>(
  "*/sites/:siteName/lastUpdated",
  "get"
)

export const buildResourceCategoryData = apiDataBuilder<ResourcePageData[]>(
  "*/sites/:siteName/resourceRoom/:resourceRoomName/resources/:resourceCategoryName",
  "get"
)

export const buildMediaData = apiDataBuilder<(MediaData | DirectoryData)[]>(
  "*/sites/:siteName/media/:mediaDirectoryName",
  "get"
)

export const buildRecentNotificationData = apiDataBuilder<NotificationData[]>(
  "*/sites/:siteName/notifications",
  "get"
)

export const buildAllNotificationData = apiDataBuilder<NotificationData[]>(
  "*/sites/:siteName/notifications/allNotifications",
  "get"
)
export const buildMarkNotificationsAsReadData = apiDataBuilder<
  NotificationData[]
>("*/sites/:siteName/notifications", "post")

export const buildGetStagingUrlData = apiDataBuilder<{ stagingUrl: string }>(
  "*/sites/:siteName/stagingUrl",
  "get"
)

export const addContributorCollaborator = () =>
  rest.post("*/sites/:siteName/collaborators", (req, res, ctx) => {
    return res(ctx.json({ error: { message: "Acknowledgement required" } }))
  })
