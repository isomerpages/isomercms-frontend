import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { EditorHeroDropdownSection } from "types/homepage"

import { HeroDropdown } from "./HeroDropdown"

interface HeroButtonProps {
  button?: string
}
const HeroButton = ({ button }: HeroButtonProps) => (
  <>
    {button ? (
      <div
        className={getClassNames(editorStyles, [
          "bp-button",
          "is-uppercase",
          "search-button",
          "default",
          "is-secondary",
        ])}
      >
        {button}
      </div>
    ) : null}
  </>
)

interface HeroCenteredLayoutProps {
  hero: {
    background?: string
    title?: string
    subtitle?: string
    button?: string
    dropdown: EditorHeroDropdownSection["dropdown"]
  }
  dropdownIsActive: boolean
  toggleDropdown: () => void
}
export const HeroCenteredLayout = ({
  hero,
  dropdownIsActive,
  toggleDropdown,
}: HeroCenteredLayoutProps) => {
  return (
    <div
      className={getClassNames(editorStyles, [
        "bp-hero-body",
        "gray-overlay",
        "with-padding",
      ])}
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
              "col",
              "is-9",
              "has-text-centered",
              "has-text-white",
            ])}
          >
            <h1
              className={getClassNames(editorStyles, [
                "display",
                "padding--bottom--lg",
                "margin--none",
              ])}
            >
              <b className={editorStyles["is-hidden-touch"]}>{hero.title}</b>
              <b className={editorStyles["is-hidden-desktop"]}>{hero.title}</b>
            </h1>
            {/* Hero subtitle */}
            {hero.subtitle ? (
              <p
                className={getClassNames(editorStyles, [
                  "is-hidden-mobile",
                  "padding--bottom--lg",
                ])}
              >
                {hero.subtitle}
              </p>
            ) : null}
            {/* Hero dropdown */}
            {hero.dropdown ? (
              <HeroDropdown
                title={hero.dropdown.title}
                options={hero.dropdown.options}
                isActive={dropdownIsActive}
                toggleDropdown={toggleDropdown}
              />
            ) : (
              <HeroButton button={hero.button} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
