import _ from "lodash"

import {
  EditorHomepageState,
  HeroFrontmatterSection,
  isDropdownSection,
  isHighlightSection,
} from "types/homepage"
import {
  validateDropdownElem,
  validateHeroSectionFields,
  validateHighlight,
  validateSection,
} from "utils"

export const getDefaultValues = (
  obj: Record<string, string>
): Record<string, string> => {
  return _.mapValues(obj, () => "")
}

const validate = <T>(
  obj: Record<string, T>,
  predicate: (key: string, val: T) => string
): string[] => {
  return _(obj)
    .entries()
    .map(([key, value]) => predicate(key, value))
    .filter()
    .value()
}

export const validateButton = (
  field: "url" | "button",
  section: { button?: string; url?: string },
  sectionType: string,
  value: string
): string => {
  // Set special error message if hero button has text but hero url is empty
  // This needs to be done separately because it relies on the state of another field
  if (field === "url" && !value && section.button) {
    return "Please specify a URL for your button"
  }

  if (
    field === "button" &&
    !section.url &&
    value &&
    sectionType !== "resources"
  ) {
    return "Please specify a URL for your button"
  }

  return ""
}

// NOTE: We might wish to extend this so that we map the values to
// error msg etc then extract an overall boolean based on that
// but for now will return a bool
export const getErrorsFromHomepageState = ({
  frontMatter,
}: EditorHomepageState): string[] => {
  // we validate the frontmatter to check that all the fields are valid
  const { sections } = frontMatter
  const [initialSection, ...rest] = sections
  const heroSection = (initialSection as HeroFrontmatterSection).hero

  let errorMessages: string[] = []
  if (isHighlightSection(heroSection)) {
    const highlightErrors = heroSection.key_highlights.reduce((acc, cur) => {
      const curError = validate(cur, validateHighlight)
      return [...acc, ...curError]
    }, errorMessages)
    errorMessages = [...errorMessages, ...highlightErrors]
  }

  // NOTE: This is mutually exclusive with the above check
  // as our hero section only has these 2 options.
  if (isDropdownSection(heroSection)) {
    const dropdownErrors = heroSection.dropdown.options.reduce((acc, cur) => {
      const curError = validate(cur, validateDropdownElem)
      return [...acc, ...curError]
    }, errorMessages)
    errorMessages = [...errorMessages, ...dropdownErrors]
  }

  const heroFieldErrors = _(heroSection)
    .omit(["key_highlights", "dropdown"])
    .mapValues((val, key) => validateHeroSectionFields(key, val))
    .values()
    .value()

  // NOTE: Section is an object keyed by the section type
  // this is, for example, `{ infobar: someValue }`
  const sectionErrors = _(rest)
    .map((section) =>
      // NOTE: Section obj contains the actual values to validate
      // this is, for example, `title`/`subtitle`/`button` etc
      _(section)
        .entries()
        .map(([sectionType, sectionObj]) => {
          return validate(sectionObj, (key, val) => {
            const baseError = validateSection(sectionType, key, val)
            const buttonError =
              key === "button" || key === "url"
                ? validateButton(key, sectionObj, sectionType, val as string)
                : ""
            return baseError || buttonError
          })
        })
        .flatten()
        .value()
    )
    .flatten()
    .value()

  return [...errorMessages, ...sectionErrors, ...heroFieldErrors]
}
