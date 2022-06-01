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
            {/* Description */}
            {description ? <p>{description}</p> : null}
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
            <div className={getClassNames(editorStyles, ["bp-sec-button"])}>
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
