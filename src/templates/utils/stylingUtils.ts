import classNames from "classnames"
import _ from "lodash"

const OVERRIDDEN_CLASS_NAMES = [
  "bp-section",
  "bp-container",
  "bp-sec-button",
  "is-inverted",
  "row",
  "col",
  "sgds-icon",
]
const UNSTYLED_CLASS_NAMES = [
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
      .filter((className) => !UNSTYLED_CLASS_NAMES.includes(className))
      .map((className) => styles[className])
      .concat(_.intersection(classes, OVERRIDDEN_CLASS_NAMES))
      .concat(_.intersection(classes, UNSTYLED_CLASS_NAMES))
  )
}
