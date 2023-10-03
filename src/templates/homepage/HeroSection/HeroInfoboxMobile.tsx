import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { SectionBackgroundColor } from "types/hero"
import { EditorHeroDropdownSection } from "types/homepage"

import { HeroDropdown } from "./HeroDropdown"

interface HeroInfoboxMobileProps {
  backgroundColor: SectionBackgroundColor
  title: string
  url?: string
  button?: string
  dropdown?: EditorHeroDropdownSection["dropdown"]
  dropdownIsActive: boolean
  toggleDropdown: () => void
}
export const HeroInfoboxMobile = ({
  dropdown,
  dropdownIsActive,
  toggleDropdown,
  url,
  button,
  title,
  backgroundColor = "white",
}: HeroInfoboxMobileProps) => {
  return (
    // NOTE: We set `mb-0` on the div because we have legacy css
    // dictating negative margin on row:last-child, which causes
    // the bottom padding to be smaller than the top.
    <div
      className={getClassNames(editorStyles, [
        "mb-0",
        "row",
        "is-vcentered",
        "is-centered",
        "is-hidden-tablet",
      ])}
      style={{
        paddingTop: "106px",
        paddingBottom: "106px",
        paddingLeft: "84px",
        paddingRight: "84px",
      }}
    >
      <div
        className={getClassNames(editorStyles, [
          "py-8",
          "px-12",
          "row",
          "is-vcentered",
          "is-centered",
          "is-flex",
          `hero-background-${backgroundColor}`,
        ])}
        style={{
          flexDirection: "column",
        }}
      >
        <div
          className={getClassNames(editorStyles, ["mb-8", "has-text-centered"])}
        >
          <h1
            className={getClassNames(editorStyles, ["h1", "hero-text-color"])}
          >
            <b className={getClassNames(editorStyles, ["is-hidden-desktop"])}>
              {title}
            </b>
          </h1>
        </div>
        {dropdown?.title ? (
          <HeroDropdown
            title={dropdown.title}
            options={dropdown.options}
            isActive={dropdownIsActive}
            toggleDropdown={toggleDropdown}
          />
        ) : (
          // NOTE: This is to mirror the template structure
          // as closely as possible.
          url &&
          button && (
            <a
              href="/"
              className={getClassNames(editorStyles, [
                "bp-button",
                "is-secondary",
                "is-uppercase",
                "search-button",
              ])}
            >
              {button}
            </a>
          )
        )}
      </div>
    </div>
  )
}
