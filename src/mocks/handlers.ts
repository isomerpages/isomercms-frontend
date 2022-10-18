import { rest } from "msw"

import {
  MOCK_NOTIFICATION_DATA,
  MOCK_ALL_NOTIFICATION_DATA,
  MOCK_USER,
} from "./constants"
import {
  buildAllNotificationData,
  buildLastUpdated,
  buildLoginData,
  buildMarkNotificationsAsReadData,
  buildRecentNotificationData,
} from "./utils"

export const handlers = [
  buildLastUpdated({ lastUpdated: "Last updated today" }),
  buildLoginData(MOCK_USER),
  buildRecentNotificationData(MOCK_NOTIFICATION_DATA),
  buildAllNotificationData(MOCK_ALL_NOTIFICATION_DATA),
  buildMarkNotificationsAsReadData([]),
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
