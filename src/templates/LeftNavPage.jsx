import PropTypes from "prop-types"

import LeftNav from "templates/pageComponents/LeftNav"
import PageHeader from "templates/pageComponents/PageHeader"

const LeftNavPage = ({ chunk, leftNavPages, fileName, title, collection }) => {
  return (
    <div>
      <PageHeader title={title} collection={collection} />
      <section className="bp-section page-content-body">
        <div className="bp-container padding--top--lg padding--bottom--xl">
          <div className="row">
            <LeftNav leftNavPages={leftNavPages} fileName={fileName} />
            <div className="col is-8 is-offset-1-desktop is-12-touch print-content page-content-body">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: chunk }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

LeftNavPage.propTypes = {
  chunk: PropTypes.string.isRequired,
  leftNavPages: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      fileName: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
}

export default LeftNavPage
