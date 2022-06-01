import PropTypes from "prop-types"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import Breadcrumb from "templates/pageComponents/Breadcrumb"

import { getClassNames } from "utils"

const TemplateContactUsHeader = forwardRef(({ agencyName }, ref) => (
  <section className={getClassNames(editorStyles, ["bp-section"])} ref={ref}>
    <div className={getClassNames(editorStyles, ["bp-container"])}>
      <div className={getClassNames(editorStyles, ["row", "is-inverted"])}>
        <div
          className={getClassNames(editorStyles, [
            "col",
            "is-8",
            "is-offset-2",
          ])}
        >
          <Breadcrumb title="Contact Us" />
        </div>
      </div>
      <div className={editorStyles.row}>
        <div
          className={getClassNames(editorStyles, [
            "col",
            "is-8",
            "is-offset-2",
          ])}
        >
          <h1
            className={getClassNames(editorStyles, [
              "display",
              "has-text-weight-semibold",
            ])}
          >
            Get in touch with
            <br />
            <span
              className={getClassNames(editorStyles, [
                "display",
                "has-text-secondary",
              ])}
            >
              {agencyName}
            </span>
          </h1>
        </div>
      </div>
    </div>
  </section>
))

TemplateContactUsHeader.propTypes = {
  agencyName: PropTypes.string,
}

export default TemplateContactUsHeader
