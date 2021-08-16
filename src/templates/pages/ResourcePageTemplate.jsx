import React from "react"
import PropTypes from "prop-types"
import { PageHeader, PageBody } from "../pageComponentsV2"

const ResourcePageTemplate = ({ chunk, pageParams }) => {
  return (
    <div>
      <section id="display-header" className="bp-section bg-secondary">
        <PageHeader pageParams={pageParams} />
      </section>
      <section className="bp-section">
        <div className="bp-container content padding--top--lg padding--bottom--xl">
          <PageBody chunk={chunk} />
        </div>
      </section>
    </div>
  )
}

ResourcePageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  resourceCategoryName: PropTypes.string.isRequired,
  resourceRoomName: PropTypes.string.isRequired,
}

export default ResourcePageTemplate
