import { DefaultBodyType, rest, RestContext, ResponseTransformer } from "msw"

import { CollaboratorData, CollaboratorRole } from "types/collaborators"
import { CommentData } from "types/comments"
import {
  MediaData,
  DirectoryData,
  PageData,
  ResourcePageData,
  GetMediaFilesDto,
  GetMediaSubdirectoriesDto,
} from "types/directory"
import { VerifySgidLoginResponseDto } from "types/login"
import { NotificationData } from "types/notifications"
import { BlobDiff, EditedItemProps, ReviewRequest } from "types/reviewRequest"
import { BackendPasswordSettings, BackendSiteSettings } from "types/settings"
import {
  CollaboratorsStats,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"
import { SiteLaunchDto } from "types/siteLaunch"
import { SiteDataRequest } from "types/sites"
import { StagingBuildStatus } from "types/stagingBuildStatus"
import { LoggedInUser } from "types/user"

type HttpVerb = "get" | "post" | "delete"

const apiDataBuilder = <T extends DefaultBodyType = DefaultBodyType>(
  endpoint: string,
  reqType: HttpVerb = "get"
) =>
  // NOTE: Should expose `transforms` rather than `mockData` + `delay`
  (
    mockData: T,
    delay?: number | "infinite",
    ...transforms: ((
      ctx: Omit<RestContext, "json" | "delay">
    ) => ResponseTransformer)[]
  ): ReturnType<typeof rest[HttpVerb]> => {
    return rest[reqType](endpoint, (req, res, ctx) => {
      return res(
        ...transforms.map((t) => t(ctx)),
        delay ? ctx.delay(delay) : ctx.delay(0),
        ctx.json(mockData)
      )
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

export const buildPasswordData = apiDataBuilder<BackendPasswordSettings>(
  "*/sites/:siteName/settings/repo-password",
  "get"
)

export const buildSiteDashboardReviewRequests = apiDataBuilder<{
  reviews: SiteDashboardReviewRequest[]
}>("*/sites/:siteName/review/summary")

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

export const buildCollaboratorRoleData = apiDataBuilder<CollaboratorRole>(
  "*/sites/:siteName/collaborators/role"
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

export const buildMediaFolderFilesData = apiDataBuilder<GetMediaFilesDto>(
  "*/sites/:siteName/media/:mediaDirectoryName/files",
  "get"
)

export const buildMediaFolderSubdirectoriesData = apiDataBuilder<GetMediaSubdirectoriesDto>(
  "*/sites/:siteName/media/:mediaDirectoryName/subdirectories",
  "get"
)

export const buildMediaFileData = apiDataBuilder<MediaData>(
  "*/sites/:siteName/media/:mediaDirectoryName/pages/:fileName",
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

export const buildGetStagingBuildStatusData = apiDataBuilder<StagingBuildStatus>(
  "*/sites/:siteName/getStagingBuildStatus",
  "get"
)

export const buildContributor = (
  shouldError = false
): ReturnType<ReturnType<typeof apiDataBuilder>> =>
  apiDataBuilder("*/sites/:siteName/collaborators", "post")(
    shouldError && {
      error: {
        message: "Acknowledgement required",
      },
    },
    undefined,
    (ctx) => ctx.status(shouldError ? 404 : 200)
  )

export const buildRemoveContributor = apiDataBuilder(
  "*/sites/:siteName/collaborators/:collaboratorId",
  "delete"
)

export const buildCommentsData = apiDataBuilder<CommentData[]>(
  "*/sites/:siteName/review/:requestId/comments",
  "get"
)

export const buildMarkCommentsAsReadData = apiDataBuilder<CommentData[]>(
  "*/sites/:siteName/review/:requestId/comments/viewedComments",
  "post"
)

export const buildReviewRequestData = apiDataBuilder<{
  reviewRequest: ReviewRequest
}>("*/sites/:siteName/review/:reviewId")

export const buildReviewRequestDiffData = apiDataBuilder<{
  items: EditedItemProps[]
}>("*/sites/:siteName/review/compare")

export const buildAllSitesData = apiDataBuilder<SiteDataRequest>(
  "*/sites",
  "get"
)

export const buildDiffData = apiDataBuilder<BlobDiff>(
  "*/sites/:siteName/review/:reviewId/blob"
)

export const buildSiteLaunchDto = apiDataBuilder<SiteLaunchDto>(
  "*/sites/:siteName/launchInfo",
  "get"
)

export const buildLaunchSite = apiDataBuilder(
  "*/sites/:siteName/launch",
  "post"
)

export const buildSgidUserData = apiDataBuilder<VerifySgidLoginResponseDto>(
  "*/auth/sgid/verify-login",
  "get"
)
