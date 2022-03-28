import PropTypes from "prop-types"

import { PageHeader, PageBody } from "templates/pageComponentsV2"

const ResourcePageTemplate = ({ chunk, pageParams, title }) => {
  return (
    <div>
      <section id="display-header" className="bp-section bg-secondary">
        <PageHeader pageParams={pageParams} title={title} />
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
}

export default ResourcePageTemplate
