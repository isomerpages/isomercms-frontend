// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint
  react/no-array-index-key: 0
 */
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

interface HeroDropdownElemProps {
  title: string
}
const HeroDropdownElem = ({ title }: HeroDropdownElemProps) => (
  <div className={editorStyles["bp-dropdown-item"]}>
    <h5>{title}</h5>
  </div>
)

interface HeroDropdownProps {
  title: string
  isActive?: boolean
  options: { title: string }[]
  toggleDropdown: () => void
}
export const HeroDropdown = ({
  title,
  options,
  isActive,
  toggleDropdown,
}: HeroDropdownProps) => (
  <div
    className={getClassNames(editorStyles, [
      "bp-dropdown",
      `${isActive ? "is-active" : null}`,
      "border-solid-gray",
      "is-full-width",
    ])}
  >
    <div className={editorStyles["bp-dropdown-trigger"]}>
      <a
        className={getClassNames(editorStyles, [
          "bp-button",
          "bp-dropdown-button",
          "hero-dropdown",
          "is-centered",
        ])}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-controls="hero-dropdown-menu"
        onClick={toggleDropdown}
        onKeyDown={toggleDropdown}
      >
        <span>
          <b>
            <p>{title}</p>
          </b>
        </span>
        <span className={getClassNames(editorStyles, ["icon", "is-small"])}>
          <i
            className={getClassNames(editorStyles, [
              "sgds-icon",
              "sgds-icon-chevron-down",
              "is-size-4",
            ])}
            aria-hidden="true"
          />
        </span>
      </a>
    </div>
    <div
      className={getClassNames(editorStyles, [
        "bp-dropdown-menu",
        "has-text-left",
      ])}
      id={editorStyles["hero-dropdown-menu"]}
      role="menu"
    >
      <div
        className={getClassNames(editorStyles, [
          "bp-dropdown-content",
          "is-centered",
        ])}
      >
        {options
          ? options.map((option, index) =>
              option.title ? (
                <HeroDropdownElem
                  key={`dropdown-${index}`}
                  title={option.title}
                />
              ) : null
            )
          : null}
      </div>
    </div>
  </div>
)
