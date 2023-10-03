// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { SectionBackgroundColor, SectionSize } from "types/hero"
import { EditorHeroDropdownSection } from "types/homepage"

import { HeroButton } from "./HeroButton"
import { HeroDropdown } from "./HeroDropdown"

const TRANSLUCENT_GRAY = "#00000080"

interface HeroInfoboxDesktopProps {
  size: SectionSize
  backgroundColor: SectionBackgroundColor
  title: string
  subtitle?: string
  url?: string
  button?: string
  dropdown?: EditorHeroDropdownSection["dropdown"]
  dropdownIsActive: boolean
  toggleDropdown: () => void
}
const HeroInfoboxDesktop = ({
  size,
  backgroundColor,
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
      className={getClassNames(editorStyles, ["p-16", "is-hidden-mobile"])}
      style={{
        width: size,
        background:
          backgroundColor === "gray" ? TRANSLUCENT_GRAY : backgroundColor,
      }}
    >
      <div className={getClassNames(editorStyles, ["py-16"])}>
        <div className={getClassNames(editorStyles, ["mb-8"])}>
          <h1 className={getClassNames(editorStyles, ["hero-title", "mb-4"])}>
            {title && (
              <>
                <b className={getClassNames(editorStyles, ["is-hidden-touch"])}>
                  {title}
                </b>
                <b
                  className={getClassNames(editorStyles, ["is-hidden-desktop"])}
                >
                  {title}
                </b>
              </>
            )}
          </h1>

          {subtitle && (
            <p
              className={getClassNames(editorStyles, [
                "is-hidden-touch",
                "hero-subtitle",
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
          url && button && <HeroButton button={button} />
        )}
      </div>
    </div>
  )
}

interface HeroSideLayoutProps {
  alignment: "left" | "right"
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
export const HeroSideLayout = ({
  alignment = "left",
  size = "50%",
  url,
  title,
  subtitle,
  button,
  backgroundColor = "white",
  dropdownIsActive,
  toggleDropdown,
  dropdown,
}: HeroSideLayoutProps) => {
  return (
    <div className={getClassNames(editorStyles, ["bp-hero-body"])}>
      {/* desktop view - done using css media queries */}
      {alignment === "left" ? (
        <HeroInfoboxDesktop
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
      ) : (
        <div className={getClassNames(editorStyles, ["is-flex", "flex-end"])}>
          <HeroInfoboxDesktop
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
      )}

      {/* mobile view - done using css media queries */}
      <div
        className={getClassNames(editorStyles, [
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
            "p-8",
            "is-vcentered",
            "is-centered",
            "is-flex",
            "col",
            "is-9",
          ])}
          style={{
            flexDirection: "column",
            background:
              backgroundColor === "gray" ? TRANSLUCENT_GRAY : backgroundColor,
          }}
        >
          <div className={getClassNames(editorStyles, ["mb-8"])}>
            <h1 className={getClassNames(editorStyles, ["hero-title", "mb-4"])}>
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
    </div>
  )
}
