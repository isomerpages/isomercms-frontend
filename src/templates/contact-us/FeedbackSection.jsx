import { sanitizeUrl } from "@braintree/sanitize-url"
import PropTypes from "prop-types"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "utils"

const TemplateFeedbackSection = forwardRef(({ feedback }, ref) => (
  <div ref={ref}>
    {feedback && (
      <div
        className={getClassNames(editorStyles, [
          "row",
          "is-multiline",
          "margin--bottom--lg",
        ])}
      >
        <div
          className={getClassNames(editorStyles, [
            "col",
            "is-12",
            "padding--bottom--none",
          ])}
        >
          <h5
            className={getClassNames(
              editorStyles,
              ["has-text-weight-semibold"],
              ["has-text-secondary"]
            )}
          >
            Send us your feedback
          </h5>
        </div>
        <div className={getClassNames(editorStyles, ["col", "is-8"])}>
          {/* fixing target='_blank' warning: https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/ */}
          <p>
            If you have a query, feedback or wish to report a problem related to
            this website, please fill in the{" "}
            <a
              href={sanitizeUrl(feedback)}
              rel="noopener noreferrer"
              target="_blank"
              onClick={(event) => event.preventDefault()}
            >
              <u>online form</u>
            </a>
            .
          </p>
        </div>
      </div>
    )}
  </div>
))

TemplateFeedbackSection.propTypes = {
  feedback: PropTypes.string,
}

export default TemplateFeedbackSection
