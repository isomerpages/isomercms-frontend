import PropTypes from "prop-types"
import { forwardRef } from "react"
import { useQuery } from "react-query"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { fetchImageURL } from "utils"
/* eslint
  react/no-array-index-key: 0
 */

const TemplateInfopicLeftSection = (
  {
    title,
    subtitle,
    description,
    button,
    sectionIndex,
    imageUrl,
    imageAlt,
    siteName,
  },
  ref
) => {
  const addDefaultSrc = (e) => {
    e.target.src = "/placeholder_no_image.png"
  }

  const { data: loadedImageURL } = useQuery(
    `${siteName}/${imageUrl}`,
    () => fetchImageURL(siteName, decodeURI(imageUrl)),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Never automatically refetch image unless query is invalidated
    }
  )

  return (
    <div ref={ref}>
      <section
        className={getClassNames(editorStyles, [
          `bp-section`,
          sectionIndex % 2 === 1 ? "bg-newssection" : null,
        ])}
      >
        <div className={editorStyles["bp-container"]}>
          {/* For mobile */}
          <div
            className={getClassNames(editorStyles, [
              "row",
              "is-hidden-desktop",
              "is-hidden-tablet-only",
            ])}
          >
            <div
              className={getClassNames(editorStyles, [
                "col",
                "is-half",
                "padding--bottom",
              ])}
            >
              <p
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "eyebrow",
                  "is-uppercase",
                ])}
              >
                {subtitle}
              </p>
              <h1
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "has-text-secondary",
                ])}
              >
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div
                className={getClassNames(editorStyles, [
                  "bp-sec-button",
                  "margin--top padding--bottom",
                ])}
              >
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className={getClassNames(editorStyles, [
                        "sgds-icon",
                        "sgds-icon-arrow-right",
                        "is-size-4",
                      ])}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className={getClassNames(editorStyles, ["col", "is-half"])}>
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
          </div>
          {/* For tablet */}
          <div
            className={getClassNames(editorStyles, [
              "row",
              "is-hidden-mobile",
              "is-hidden-desktop",
            ])}
          >
            <div className={getClassNames(editorStyles, ["col", "is-half"])}>
              <p
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "eyebrow",
                  "is-uppercase",
                ])}
              >
                {subtitle}
              </p>
              <h1
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "has-text-secondary",
                ])}
              >
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div
                className={getClassNames(editorStyles, [
                  "bp-sec-button",
                  "margin--top",
                  "padding--bottom",
                ])}
              >
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className={getClassNames(editorStyles, [
                        "sgds-icon",
                        "sgds-icon-arrow-right",
                        "is-size-4",
                      ])}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className={getClassNames(editorStyles, [
                "col",
                "is-half",
                "is-half",
                "padding--top--xl",
                "padding--bottom--xl",
              ])}
            >
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
          </div>
          {/* For desktop */}
          <div
            className={getClassNames(editorStyles, [
              "row",
              "is-hidden-mobile",
              "is-hidden-tablet-only",
            ])}
          >
            <div
              className={getClassNames(editorStyles, [
                "col",
                "is-half",
                "padding--top--xl",
                "padding--bottom--xl",
                "padding--left--xl",
                "padding--right--xl",
              ])}
            >
              <p
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "eyebrow",
                  "is-uppercase",
                ])}
              >
                {subtitle}
              </p>
              <h1
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "has-text-secondary",
                ])}
              >
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div
                className={getClassNames(editorStyles, [
                  "margin--top",
                  "padding--bottom",
                  "bp-sec-button",
                ])}
              >
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className={getClassNames(editorStyles, [
                        "sgds-icon",
                        "sgds-icon-arrow-right",
                        "is-size-4",
                      ])}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className={getClassNames(editorStyles, [
                "col",
                "is-half",
                "padding--top--xl",
                "padding--bottom--xl",
              ])}
            >
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default forwardRef(TemplateInfopicLeftSection)

TemplateInfopicLeftSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  siteName: PropTypes.string.isRequired,
}

TemplateInfopicLeftSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  description: undefined,
}
