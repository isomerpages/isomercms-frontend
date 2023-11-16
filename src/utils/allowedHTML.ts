import DOMPurify from "dompurify"

import * as CspService from "services/CspService"

import checkCSP from "./cspUtils"

/**
 * HTML tag that do not count towards the total
 * character limit.
 */
const IFRAME_TAG_REGEX = new RegExp("(<iframe.*/iframe>)", "gm")

/**
 * @param text raw text input by user
 * @returns the character length after removing specifc HTML tags
 */
export const getLengthWithoutTags = (text: string): number => {
  return text.replace(IFRAME_TAG_REGEX, "").length
}

/**
 * Utility method for determinign if the given HTML embed code adheres to our
 * Content Security Policy.
 */
export const isEmbedCodeValid = (
  csp: Awaited<ReturnType<typeof CspService.get>> | undefined,
  embedCode: string | undefined
) => {
  if (!csp || !embedCode) return false

  const {
    isCspViolation: checkedIsCspViolation,
    sanitisedHtml: CSPSanitisedHtml,
  } = checkCSP(csp, embedCode)
  DOMPurify.sanitize(CSPSanitisedHtml)

  // Using FORCE_BODY adds a fake <remove></remove>
  DOMPurify.removed = DOMPurify.removed.filter(
    (el) => el.element?.tagName !== "REMOVE"
  )

  return !checkedIsCspViolation && DOMPurify.removed.length === 0
}
