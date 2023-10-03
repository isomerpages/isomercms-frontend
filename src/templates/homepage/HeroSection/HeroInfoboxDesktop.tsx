import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import {
  SectionAlignment,
  SectionBackgroundColor,
  SectionSize,
} from "types/hero"
import { EditorHeroDropdownSection } from "types/homepage"

import { HeroButton } from "./HeroButton"
import { HeroDropdown } from "./HeroDropdown"

interface HeroInfoboxDesktopProps {
  alignment: SectionAlignment

  size: SectionSize
  backgroundColor: SectionBackgroundColor
  title: string
  subtitle?: string
  url?: string
  button?: string
  dropdown?: EditorHeroDropdownSection["dropdown"]
  dropdownIsActive: boolean
  toggleDropdown: () => void
  variant: "side" | "floating"
}

export const HeroInfoboxDesktop = ({
  variant,
  alignment = "left",
  size = "md",
  backgroundColor = "white",
  title,
  subtitle,
  dropdown,
  dropdownIsActive,
  toggleDropdown,
  url,
  button,
}: HeroInfoboxDesktopProps) => {
  return (
    <div
      className={getClassNames(editorStyles, [
        "is-flex",
        `${alignment === "right" ? "flex-end" : "flex-start"}`,
      ])}
    >
      <div
        className={getClassNames(editorStyles, [
          "p-16",
          `hero-background-${backgroundColor}`,
          "is-flex",
          `hero-${variant}-${size}`,
        ])}
        style={{
          flexDirection: "column",
        }}
      >
        <div
          className={getClassNames(
            editorStyles,
            variant === "side" ? ["side-section-infobox-container"] : []
          )}
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: alignment === "right" ? "flex-start" : "flex-end",
          }}
        >
          <div
            className={getClassNames(editorStyles, ["mb-8", "is-flex"])}
            style={{ flexDirection: "column" }}
          >
            <h1
              className={getClassNames(editorStyles, [
                "h1",
                "mb-4",
                "hero-text-color",
              ])}
            >
              <b>{title}</b>
            </h1>

            {subtitle && (
              <p
                className={getClassNames(editorStyles, [
                  "is-hidden-touch",
                  "body-2",
                  "hero-text-color",
                ])}
              >
                {subtitle}
              </p>
            )}
          </div>
          {dropdown?.title ? (
            <div
              className={getClassNames(editorStyles, [
                "is-flex",
                "is-full-width",
              ])}
              style={{
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <HeroDropdown
                title={dropdown.title}
                options={dropdown.options}
                isActive={dropdownIsActive}
                toggleDropdown={toggleDropdown}
              />
            </div>
          ) : (
            // NOTE: This is to mirror the template structure
            // as closely as possible.
            url &&
            button && (
              <div>
                <HeroButton button={button} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
