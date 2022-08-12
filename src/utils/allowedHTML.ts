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
  let finalText = text

  finalText = finalText.replace(IFRAME_TAG_REGEX, "")

  return finalText.length
}
