import PropTypes from "prop-types"

import { PageHeader, PageBody, LeftNav } from "templates/pageComponentsV2"

const CollectionPageTemplate = ({ chunk, pageParams, title, siteName }) => {
  return (
    <div>
      <section
        id="display-header"
        className="bp-section is-small bp-section-pagetitle"
      >
        <PageHeader pageParams={pageParams} title={title} />
      </section>
      <section className="bp-section page-content-body">
        <div className="bp-container padding--top--lg padding--bottom--xl">
          <div className="row">
            <LeftNav
              siteName={siteName}
              collectionName={pageParams.collectionName}
              fileName={pageParams.fileName}
            />
            <PageBody chunk={chunk} />
          </div>
        </div>
      </section>
    </div>
  )
}

CollectionPageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  pageParams: {
    fileName: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
    subCollectionName: PropTypes.string,
  },
  siteName: PropTypes.string.isRequired,
}

export default CollectionPageTemplate
