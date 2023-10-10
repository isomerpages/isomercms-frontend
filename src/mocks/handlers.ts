import { rest } from "msw"

import {
  MOCK_NOTIFICATION_DATA,
  MOCK_ALL_NOTIFICATION_DATA,
  MOCK_USER,
} from "./constants"
import {
  buildAllNotificationData,
  buildCollaboratorData,
  buildLastUpdated,
  buildLoginData,
  buildMarkNotificationsAsReadData,
  buildRecentNotificationData,
} from "./utils"

export const handlers = [
  buildLastUpdated({ lastUpdated: new Date().toISOString() }),
  buildLoginData(MOCK_USER),
  buildRecentNotificationData(MOCK_NOTIFICATION_DATA),
  buildAllNotificationData(MOCK_ALL_NOTIFICATION_DATA),
  buildMarkNotificationsAsReadData([]),
  buildCollaboratorData({ collaborators: [] }),
]

export const contactUsHandler = (
  showContactUs?: boolean,
  delay?: number | "infinite"
): ReturnType<typeof rest["get"]> =>
  rest.get("/sites/:siteName/pages/contact-us.md", (req, res, ctx) => {
    return res(
      delay ? ctx.delay(delay) : ctx.delay(0),
      ctx.json(
        showContactUs && {
          name: "contact-us.md",
          content: {
            frontMatter: {
              layout: "contact_us",
            },
          },
        }
      )
    )
  })

export const updateViewedReviewRequestsHandler = rest.post(
  "*/sites/:siteName/review/viewed",
  (req, res, ctx) => {
    return res(ctx.status(200))
  }
)

export const markReviewRequestAsViewedHandler = rest.post(
  "*/sites/:siteName/review/:reviewId/viewed",
  (req, res, ctx) => {
    return res(ctx.status(200))
  }
)
