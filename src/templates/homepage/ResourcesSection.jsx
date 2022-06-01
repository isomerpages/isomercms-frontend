import PropTypes from "prop-types"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "utils"

/* eslint
  react/no-array-index-key: 0
 */

const ResourcePost = () => (
  <div className={editorStyles.col}>
    <div className={editorStyles["is-media-card"]}>
      <div
        className={getClassNames(editorStyles, [
          "media-card-plain",
          "bg-media-color-0",
          "padding--lg",
        ])}
      >
        <div>
          <small
            className={getClassNames(editorStyles, [
              "has-text-white",
              "padding--bottom",
            ])}
          >
            DEMO CATEGORY
          </small>
          <h4
            className={getClassNames(editorStyles, [
              "has-text-white",
              "padding--bottom--lg",
            ])}
            style={{ lineHeight: "2.25em" }}
          >
            <b>TITLE</b>
          </h4>
        </div>
        <div
          className={getClassNames(editorStyles, [
            "is-fluid",
            "padding--top--md description",
          ])}
        >
          <small className={editorStyles["has-text-white"]}>DATE</small>
        </div>
      </div>
    </div>
  </div>
)

const TemplateResourceSection = (
  { title, subtitle, button, sectionIndex },
  ref
) => (
  <div ref={ref}>
    <section
      className={getClassNames(editorStyles, [
        "bp-section",
        sectionIndex % 2 === 1 ? "bg-newssection" : null,
      ])}
    >
      <div className={editorStyles["bp-container"]}>
        <div className={editorStyles.row}>
          <div
            className={getClassNames(editorStyles, [
              "col",
              "is-half",
              "is-offset-one-quarter",
              "has-text-centered",
              "padding--top--lg",
            ])}
          >
            {/* Subtitle */}
            {subtitle ? (
              <p
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "eyebrow",
                  "is-uppercase",
                ])}
              >
                {subtitle}
              </p>
            ) : null}
            {/* Title */}
            {title ? (
              <h1
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "has-text-secondary",
                ])}
              >
                <b>{title}</b>
              </h1>
            ) : null}
          </div>
        </div>
        <div className="watermark-container">
          <div
            className={getClassNames(editorStyles, [
              "row",
              "padding--bottom",
              "resource-sample-mask",
            ])}
          >
            <ResourcePost />
            <ResourcePost />
            <ResourcePost />
          </div>
          <div className="d-flex flex-column watermark-text">
            <span className="watermark-text-title">PLACEHOLDER MEDIA</span>
            <span className="watermark-text-content">
              Your 3 latest resources will be displayed here.
            </span>
            <span className="watermark-text-content">
              You may change the resources displayed by changing the date of the
              resource in the resources section.
            </span>
          </div>
        </div>
        <div
          className={getClassNames(editorStyles, [
            "row",
            "has-text-centered",
            "margin--top",
            "padding--bottom--lg",
          ])}
        >
          <div
            className={getClassNames(editorStyles, [
              "col",
              "is-offset-one-third",
              "is-one-third",
            ])}
          >
            <div className={getClassNames(editorStyles, ["bp-sec-button"])}>
              <div
                className={getClassNames(editorStyles, [
                  "d-flex",
                  "align-items-center",
                  "justify-content-center",
                ])}
              >
                <span>{button || "MORE"}</span>
                <i
                  className={getClassNames(editorStyles, [
                    "sgds-icon",
                    "sgds-icon-arrow-right",
                    "is-size-4",
                  ])}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

TemplateResourceSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  button: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
}

TemplateResourceSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  button: undefined,
}

export default forwardRef(TemplateResourceSection)
