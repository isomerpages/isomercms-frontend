import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

export const HeroImageOnlyLayout = () => {
  return (
    <div className={getClassNames(editorStyles, ["bp-hero-body"])}>
      <div
        className={getClassNames(editorStyles, [
          "bp-container",
          "margin--top--lg",
        ])}
      >
        <div
          className={getClassNames(editorStyles, [
            "row",
            "is-vcentered",
            "is-centered",
            "ma",
          ])}
        >
          <div className={getClassNames(editorStyles, ["min-height-mobile"])} />
        </div>
      </div>
    </div>
  )
}
