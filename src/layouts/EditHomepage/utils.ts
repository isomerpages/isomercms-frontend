import _ from "lodash"

import {
  EditorHomepageState,
  HeroFrontmatterSection,
  isDropdownSection,
  isHighlightSection,
} from "types/homepage"
import { validateDropdownElem, validateHighlight, validateSection } from "utils"

export const getDefaultValues = (
  obj: Record<string, string>
): Record<string, string> => {
  return _.mapValues(obj, () => "")
}

// NOTE: We might wish to extend this so that we map the values to
// error msg etc then extract an overall boolean based on that
// but for now will return a bool
export const getHasErrorFromHomepageState = ({
  frontMatter,
}: EditorHomepageState) => {
  // we validate the frontmatter to check that all the fields are valid
  const { sections } = frontMatter
  const [initialSection, ...rest] = sections
  const heroSection = (initialSection as HeroFrontmatterSection).hero

  let hasError = false
  if (isHighlightSection(heroSection)) {
    hasError = heroSection.key_highlights.reduce((acc, cur) => {
      const curErr = _(cur)
        .entries()
        .map(([key, value]) => validateHighlight(key, value))
        .some()
      return acc || curErr
    }, hasError)
  }

  // NOTE: This is mutually exclusive with the above check
  // as our hero section only has these 2 options.
  if (isDropdownSection(heroSection)) {
    hasError = heroSection.dropdown.options.reduce((acc, cur) => {
      const curError = _(cur)
        .entries()
        .map(([key, value]) => validateDropdownElem(key, value))
        .some()
      return acc || curError
    }, hasError)
  }

  // NOTE: Section is an object keyed by the section type
  // this is, for example, `{ infobar: someValue }`
  const hasSectionErrors = _(rest)
    .map((section) =>
      // NOTE: Section obj contains the actual values to validate
      // this is, for example, `title`/`subtitle`/`button` etc
      _.entries(section).map(([sectionType, sectionObj]) =>
        // NOTE: Check if there is some value for which validation failed
        // we know validation fail as it returns a non-empty string
        _.some(
          sectionObj,
          (val, key) => !!validateSection(sectionType, key, val)
        )
      )
    )
    .flatten()
    .some()

  return hasError || hasSectionErrors
}
