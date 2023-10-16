import PropTypes from "prop-types"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

/* eslint
  react/no-array-index-key: 0
 */

const TemplateInfobarSection = (
  { title, subtitle, description, button, sectionIndex },
  ref
) => (
  <div ref={ref}>
    <section
      className={getClassNames(editorStyles, [
        `bp-section`,
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
              "padding--top--xl",
            ])}
          >
            {/* Subtitle */}
            {subtitle ? (
              <p
                className={getClassNames(editorStyles, [
                  "padding--bottom",
                  "subtitle-2",
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
                  "h1",
                ])}
              >
                <b>{title}</b>
              </h1>
            ) : null}
            {/* Description */}
            {description ? (
              <p className={getClassNames(editorStyles, ["body-1"])}>
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {/* Button */}
      {button ? (
        <div
          className={getClassNames(editorStyles, [
            "row",
            "has-text-centered",
            "margin--top",
            "padding--bottom",
          ])}
        >
          <div
            className={getClassNames(editorStyles, [
              "col",
              "is-offset-one-third",
              "is-one-third",
            ])}
          >
            <div
              className={getClassNames(editorStyles, [
                "link-button",
                "remove-after",
                "is-flex",
                "is-vh-centered",
                "flex-center",
              ])}
            >
              <span
                className={getClassNames(editorStyles, ["link-button-text"])}
              >
                {button}
              </span>
              <i
                className={getClassNames(editorStyles, [
                  "sgds-icon",
                  "sgds-icon-arrow-right",
                  "is-size-4",
                  "ml-3",
                ])}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  </div>
)

TemplateInfobarSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
}

TemplateInfobarSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  description: undefined,
}

export default forwardRef(TemplateInfobarSection)
