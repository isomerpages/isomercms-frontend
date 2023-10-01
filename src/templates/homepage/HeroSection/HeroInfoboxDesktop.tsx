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

const BASE_TITLE_CONTAINER_STYLES = ["mb-8", "is-flex"]

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
  const SIDE_SECTION_TITLE_CONTAINER_STYLES = [
    "side-section-infobox-container",
    `side-section-container-${alignment}`,
  ]

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
          className={getClassNames(editorStyles, [
            ...BASE_TITLE_CONTAINER_STYLES,
            ...(variant === "side" ? SIDE_SECTION_TITLE_CONTAINER_STYLES : []),
          ])}
          style={{
            flexDirection: "column",
          }}
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
            className={getClassNames(editorStyles, ["is-flex"])}
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
            <div
              className={getClassNames(editorStyles, [
                `hero-alignment-${alignment}`,
              ])}
            >
              <HeroButton button={button} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
