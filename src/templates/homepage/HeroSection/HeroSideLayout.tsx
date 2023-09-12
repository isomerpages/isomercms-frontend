import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

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
  )
}

interface HeroInfoboxDesktopProps extends HeroInfoboxProps {
  size: "half" | "one-third"
}
const HeroInfoboxDesktop = ({ size, ...rest }: HeroInfoboxDesktopProps) => {
  return (
    <>
      {size === "half" ? (
        <div
          className={getClassNames(editorStyles, [
            "bg-white",
            "p16",
            "is-hidden-mobile",
          ])}
          style={{
            width: "50%",
          }}
        >
          <HeroInfobox {...rest} />
        </div>
      ) : (
        <div
          className={getClassNames(editorStyles, [
            "bg-white",
            "p16",
            "is-hidden-mobile",
          ])}
          style={{
            width: "33%",
          }}
        >
          <HeroInfobox {...rest} />
        </div>
      )}
    </>
  )
}

interface HeroSideLayoutProps {
  alignment: "left" | "right"
  size: "half" | "one-third"
  url?: string
  button?: string
  subtitle?: string
  title: string
}
export const HeroSideLayout = ({
  alignment = "left",
  size = "half",
  url,
  title,
  subtitle,
  button,
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
        />
      ) : (
        <div className={getClassNames(editorStyles, ["is-flex", "flex-end"])}>
          <HeroInfoboxDesktop
            size={size}
            url={url}
            button={button}
            title={title}
            subtitle={subtitle}
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
            "bg-white",
            "p8",
            "row",
            "is-vcentered",
            "is-centered",
            "is-flex",
          ])}
          style={{
            flexDirection: "column",
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
