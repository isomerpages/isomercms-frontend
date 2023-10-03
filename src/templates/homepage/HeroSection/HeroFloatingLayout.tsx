// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

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
import { HeroInfoboxDesktop } from "./HeroInfoboxDesktop"
import { HeroInfoboxMobile } from "./HeroInfoboxMobile"

interface HeroFloatingLayoutProps {
  alignment: SectionAlignment
  size: SectionSize
  url?: string
  button?: string
  subtitle?: string
  title: string
  backgroundColor: SectionBackgroundColor
  dropdownIsActive: boolean
  toggleDropdown: () => void
  dropdown?: EditorHeroDropdownSection["dropdown"]
}
export const HeroFloatingLayout = ({
  alignment = "left",
  size = "md",
  url,
  title,
  subtitle,
  button,
  backgroundColor,
  dropdownIsActive,
  toggleDropdown,
  dropdown,
}: HeroFloatingLayoutProps) => {
  return (
    <div
      className={getClassNames(editorStyles, ["hero-floating", "bp-hero-body"])}
    >
      {/* desktop view - done using css media queries */}
      <div
        className={getClassNames(editorStyles, [
          "is-hidden-touch",
          "infobox-floating-container",
        ])}
      >
        <HeroInfoboxDesktop
          variant="floating"
          alignment={alignment}
          size={size}
          url={url}
          button={button}
          title={title}
          subtitle={subtitle}
          backgroundColor={backgroundColor}
          dropdownIsActive={dropdownIsActive}
          toggleDropdown={toggleDropdown}
          dropdown={dropdown}
        />
      </div>

      {/* tablet view - done using css media queries */}
      <div
        className={getClassNames(editorStyles, [
          "mb-0",
          "is-visible-tablet-only",
        ])}
      >
        <div
          className={getClassNames(editorStyles, [
            "p-8",
            `hero-background-${backgroundColor}`,
          ])}
        >
          <div
            className={getClassNames(editorStyles, [
              "is-flex",
              `${alignment === "right" ? "flex-end" : "flex-start"}`,
            ])}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className={getClassNames(editorStyles, ["mb-8"])}>
                <h1
                  className={getClassNames(editorStyles, [
                    "h1",
                    "hero-text-color",
                  ])}
                >
                  <b>{title}</b>
                </h1>
              </div>

              <div
                className={getClassNames(editorStyles, [
                  "is-flex",
                  `${alignment === "right" ? "flex-end" : "flex-start"}`,
                ])}
                style={{
                  display: "flex",
                  alignContent: "center",
                }}
              >
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
          </div>
        </div>
      </div>

      {/* mobile view - done using css media queries */}
      <div className={getClassNames(editorStyles, ["is-hidden-tablet"])}>
        <HeroInfoboxMobile
          dropdownIsActive={dropdownIsActive}
          toggleDropdown={toggleDropdown}
          dropdown={dropdown}
          url={url}
          button={button}
          title={title}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  )
}
