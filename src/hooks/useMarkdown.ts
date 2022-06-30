import Turndown from "turndown"
import { gfm } from "turndown-plugin-gfm"

type useMarkdownReturnType = {
  toMarkdown: (html: string) => string
}

// NOTE: This custom hook enforces the usage of the GFM flavoured markdown through the plugin.
// This also intentionally limits the exported methods to solely the markdown conversion and prevents any further
// alteration of the turndown object once initiated
// eslint-disable-next-line import/prefer-default-export
export const useMarkdown = (
  options: Turndown.Options
): useMarkdownReturnType => {
  const turndown = new Turndown(options)
  turndown.use(gfm)
  return {
    toMarkdown: (html: string) => turndown.turndown(html),
  }
}
