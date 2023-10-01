import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { EditorHeroDropdownSection } from "types/homepage"

import { HeroButton } from "./HeroButton"
import { HeroDropdown } from "./HeroDropdown"

interface HeroImageOnlyLayoutProps {
  dropdown?: EditorHeroDropdownSection["dropdown"]
  button?: string
  dropdownIsActive: boolean
  toggleDropdown: () => void
}
export const HeroImageOnlyLayout = ({
  dropdown,
  button,
  dropdownIsActive,
  toggleDropdown,
}: HeroImageOnlyLayoutProps) => {
  return (
    <div
      className={getClassNames(editorStyles, [
        "bp-hero-body, hero-body-padding",
      ])}
    >
      <div
        className={getClassNames(editorStyles, [
          "bp-container",
          "margin--top--lg",
        ])}
      >
        <div className={getClassNames(editorStyles, ["row"])}>
          <div
            className={getClassNames(editorStyles, [
              "min-height-mobile",
              "is-flex",
              "is-full-width",
              "is-vh-centered",
            ])}
          >
            {dropdown?.title ? (
              <div className={getClassNames(editorStyles, ["col", "is-9"])}>
                <HeroDropdown
                  title={dropdown.title}
                  options={dropdown.options}
                  isActive={dropdownIsActive}
                  toggleDropdown={toggleDropdown}
                />
              </div>
            ) : (
              <HeroButton button={button} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
