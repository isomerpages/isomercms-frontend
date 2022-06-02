import classNames from "classnames"
import _ from "lodash"

// Styles which are used in both imported stylesheet and inserted in siteColorUtils
const OVERRIDDEN_CLASS_NAMES = [
  "bp-section",
  "bp-container",
  "bp-sec-button",
  "is-inverted",
  "row",
  "col",
  "sgds-icon",
]

// Styles related to colours - only use the original name so that our colours take precedence
// over the !important styles defined in the imported stylesheets
const INSERTED_CLASS_NAMES = [
  "has-text-secondary",
  "bg-secondary",
  "is-secondary",
]

export const getClassNames = (
  styles: Record<string, string>,
  classes: string[]
) => {
  // Generates relevant class, with classes using the provided styles
  return classNames(
    classes
      .filter((className) => !INSERTED_CLASS_NAMES.includes(className))
      .map((className) => styles[className])
      .concat(_.intersection(classes, OVERRIDDEN_CLASS_NAMES))
      .concat(_.intersection(classes, INSERTED_CLASS_NAMES))
  )
}
