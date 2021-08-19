import React from "react"
import PropTypes from "prop-types"
import { PageHeader, PageBody } from "../pageComponentsV2"

const PageTemplate = ({ chunk, pageParams }) => (
  <div>
    <section
      id="display-header"
      className="bp-section is-small bp-section-pagetitle"
    >
      <PageHeader pageParams={pageParams} />
    </section>
    <section className="bp-section">
      <div className="bp-container content padding--top--lg padding--bottom--xl">
        <PageBody chunk={chunk} />
      </div>
    </section>
  </div>
)

PageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  pageParams: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
  }),
}

export default PageTemplate
