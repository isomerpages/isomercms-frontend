// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint
  react/no-array-index-key: 0
 */

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

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
const HeroDropdown = ({
  title,
  options,
  isActive,
  toggleDropdown,
}: HeroDropdownProps) => (
  <div
    className={getClassNames(editorStyles, [
      "bp-dropdown",
      "margin--top--sm",
      `${isActive ? "is-active" : null}`,
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

interface HeroCenteredLayoutProps {
  hero: {
    background?: string
    title?: string
    subtitle?: string
    button?: string
    dropdown: {
      title: string
      options: { title: string }[]
    }
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
