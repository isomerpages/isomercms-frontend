import parse from "content-security-policy-parser"
import DOMPurify from "dompurify"

import checkCSP from "utils/cspUtils"

import { MediaData } from "types/directory"
import { adjustImageSrcs } from "utils"

DOMPurify.setConfig({
  ADD_TAGS: ["iframe", "#comment", "script"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "scrolling",
    "marginheight",
    "marginwidth",
    "target",
    "async",
    "mozallowfullscreen",
    "webkitallowfullscreen",
  ],
  // required in case <script> tag appears as the first line of the markdown
  FORCE_BODY: true,
})
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  // Allow script tags if it has a src attribute
  // Script sources are handled by our CSP sanitiser
  if (
    data.tagName === "script" &&
    !(node.hasAttribute("src") && node.innerHTML === "")
  ) {
    // Adapted from https://github.com/cure53/DOMPurify/blob/e0970d88053c1c564b6ccd633b4af7e7d9a10375/src/purify.js#L719-L736
    DOMPurify.removed.push({ element: node })
    try {
      node.parentNode?.removeChild(node)
    } catch (e) {
      try {
        // eslint-disable-next-line no-param-reassign
        node.outerHTML = ""
      } catch (ex) {
        node.remove()
      }
    }
  }
})

// NOTE: Force callers to go through this
// so that we cannot inject arbitrary HTML
export const sanitiseRawHtml = (
  csp: ReturnType<typeof parse>,
  html: string
): { sanitisedHtml: TrustedHTML; isCspViolation: boolean } => {
  const { sanitisedHtml: CSPSanitisedHtml, isCspViolation } = checkCSP(
    csp,
    html
  )

  const sanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml, {
    RETURN_TRUSTED_TYPE: true,
  })

  return {
    sanitisedHtml,
    isCspViolation,
  }
}

// TODO: maintain trusted html guarantee
export const updateHtmlWithMediaData = (
  mediaSources: Set<string>,
  sanitisedHtml: TrustedHTML,
  mediaData: MediaData[] = []
): { html: string; isXssViolation: boolean; isContentViolation: boolean } => {
  const processedChunk = adjustImageSrcs(sanitisedHtml.toString(), mediaData)

  // Using FORCE_BODY adds a fake <remove></remove>
  DOMPurify.removed = DOMPurify.removed.filter(
    (el) => el.element?.tagName !== "REMOVE"
  )

  return {
    isXssViolation: DOMPurify.removed.length > 0,
    isContentViolation: mediaSources.size > 0,
    // TODO: Check if adjusting the src
    // violates sanitization guarantees
    html: processedChunk,
  }
}
