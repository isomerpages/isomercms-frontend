import classNames from "classnames"

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

interface StylesProps {
  [key: string]: string
}

export const getClassNames = (styles: StylesProps, classes: string[]) => {
  // Generates relevant class, with classes using the provided styles
  const styledClasses: string[] = []
  classes.forEach((className) => {
    if (UNSTYLED_CLASS_NAMES.includes(className)) {
      // Styles related to colours - only use the original name so that our colours take precedence
      styledClasses.push(className)
    } else if (OVERRIDDEN_CLASS_NAMES.includes(className)) {
      // Styles which affect our inserted styles - require both our css and the imported css
      styledClasses.push(className)
      styledClasses.push(styles[className])
    } else {
      styledClasses.push(styles[className])
    }
  })
  return classNames(styledClasses)
}
