/**
 * Defines the list of allowed HTML tags that do not count towards the total
 * character limit.
 *
 */
const regrexTests = [
  new RegExp("(<iframe.*/iframe>)", "gm"),
  new RegExp("(<div.*/div>)", "gm"),
]

/**
 * @param text raw text input by user
 * @returns the character length after removing specifc HTML tags
 */
export const getLengthWithoutTags = (text: string): number => {
  let finalText = text
  for (const regrexTest of regrexTests) {
    finalText = finalText.replace(regrexTest, "")
  }
  return finalText.length
}
