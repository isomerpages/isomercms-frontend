// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { SectionBackgroundColor, SectionSize } from "types/hero"

const TRANSLUCENT_GRAY = "#00000080"

interface HeroInfoboxProps {
  title: string
  subtitle?: string
  url?: string
  button?: string
}
const HeroInfobox = ({ title, subtitle, url, button }: HeroInfoboxProps) => {
  return (
    <div className={getClassNames(editorStyles, ["py16"])}>
      <div className={getClassNames(editorStyles, ["mb8"])}>
        <h1 className={getClassNames(editorStyles, ["hero-title", "mb4"])}>
          {title && (
            <>
              <b className={getClassNames(editorStyles, ["is-hidden-touch"])}>
                {title}
              </b>
              <b className={getClassNames(editorStyles, ["is-hidden-desktop"])}>
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

        {url && button && (
          <a
            className={getClassNames(editorStyles, [
              "bp-button",
              "is-secondary",
              "is-uppercase",
              "search-button",
            ])}
          >
            {button}
          </a>
        )}
      </div>
    </div>
  )
}

interface HeroInfoboxDesktopProps extends HeroInfoboxProps {
  size: SectionSize
  backgroundColor: SectionBackgroundColor
}
const HeroInfoboxDesktop = ({
  size,
  backgroundColor,
  ...rest
}: HeroInfoboxDesktopProps) => {
  return (
    <div
      className={getClassNames(editorStyles, ["p16", "is-hidden-mobile"])}
      style={{
        width: size,
        background:
          backgroundColor === "gray" ? TRANSLUCENT_GRAY : backgroundColor,
      }}
    >
      <HeroInfobox {...rest} />
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
}
export const HeroSideLayout = ({
  alignment = "left",
  size = "50%",
  url,
  title,
  subtitle,
  button,
  backgroundColor,
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
            "p8",
            "row",
            "is-vcentered",
            "is-centered",
            "is-flex",
          ])}
          style={{
            flexDirection: "column",
            background:
              backgroundColor === "gray" ? TRANSLUCENT_GRAY : backgroundColor,
          }}
        >
          <div className={getClassNames(editorStyles, ["mb8"])}>
            <h1 className={getClassNames(editorStyles, ["hero-title", "mb4"])}>
              <b className={getClassNames(editorStyles, ["is-hidden-desktop"])}>
                {title}
              </b>
            </h1>
          </div>
          {url && button && (
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
          )}
        </div>
      </div>
    </div>
  )
}
