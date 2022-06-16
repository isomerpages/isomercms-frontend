import { rest } from "msw"

// NOTE: redefining this here (and not using .env values) as storybook will override the env values
// Only env vars prefixed with STORYBOOK_ will exist in the storybook
// But because this is outside of storybook, will not exist there.
const BACKEND_URL = "http://localhost:8081/v1"

export const handlers = [
  rest.get(`${BACKEND_URL}/sites/:siteName/lastUpdated`, (req, res, ctx) => {
    return res(
      ctx.json({
        lastUpdated: "Last updated today",
      })
    )
  }),
]
