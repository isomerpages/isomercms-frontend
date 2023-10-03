import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

interface HeroButtonProps {
  button?: string
}
export const HeroButton = ({ button }: HeroButtonProps) => (
  <>
    {button && (
      <div
        className={getClassNames(editorStyles, [
          "bp-button",
          "is-uppercase",
          "search-button",
          "is-secondary",
        ])}
      >
        {button}
      </div>
    )}
  </>
)
