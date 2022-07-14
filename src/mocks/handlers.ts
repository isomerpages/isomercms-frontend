import { rest } from "msw"

export const handlers = [
  rest.get(`*/sites/:siteName/lastUpdated`, (req, res, ctx) => {
    return res(
      ctx.json({
        lastUpdated: "Last updated today",
      })
    )
  }),
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
