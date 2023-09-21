import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { EditorHeroDropdownSection } from "types/homepage"

import { HeroDropdown } from "./HeroDropdown"

interface HeroImageOnlyLayoutProps {
  dropdown?: EditorHeroDropdownSection["dropdown"]
  dropdownIsActive: boolean
  toggleDropdown: () => void
}
export const HeroImageOnlyLayout = ({
  dropdown,
  dropdownIsActive,
  toggleDropdown,
}: HeroImageOnlyLayoutProps) => {
  return (
    <div
      className={getClassNames(editorStyles, ["bp-hero-body, with-padding"])}
    >
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
          <div
            className={getClassNames(editorStyles, [
              "min-height-mobile",
              "is-flex",
              "row",
              "is-vcentered",
              "is-centered",
            ])}
          >
            {dropdown && (
              <HeroDropdown
                title={dropdown.title}
                options={dropdown.options}
                isActive={dropdownIsActive}
                toggleDropdown={toggleDropdown}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
