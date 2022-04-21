import PropTypes from "prop-types"

import { PageHeader, PageBody } from "templates/pageComponentsV2"

const PageTemplate = ({ chunk, pageParams, title }) => (
  <div>
    <section
      id="display-header"
      className="bp-section is-small bp-section-pagetitle"
    >
      <PageHeader pageParams={pageParams} title={title} />
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
