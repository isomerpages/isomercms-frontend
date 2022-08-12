/**
 * Defines the list of allowed HTML tags that do not count towards the total
 * character limit.
 *
 */

const iFrameRegrexTest = new RegExp("(<iframe.*/iframe>)", "gm")

/**
 * @param text raw text input by user
 * @returns the character length after removing specifc HTML tags
 */
export const getLengthWithoutTags = (text: string): number => {
  const removeIFrameTags = text.replace(iFrameRegrexTest, "")
  return removeIFrameTags.length
}
