import { rest } from "msw"

import { MOCK_USER } from "./constants"
import { buildLastUpdated, buildLoginData } from "./utils"

export const handlers = [
  buildLastUpdated({ lastUpdated: "Last updated today" }),
  buildLoginData(MOCK_USER),
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
