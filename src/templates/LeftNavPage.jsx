import React from "react"
import PropTypes from "prop-types"
import _ from "lodash"
import PageHeader from "./pageComponents/PageHeader"
import LeftNav from "./pageComponents/LeftNav"

const LeftNavPage = ({ chunk, dirData, fileName, title, collection }) => {
  return (
    <div>
      <PageHeader title={title} collection={collection} />
      <section className="bp-section page-content-body">
        <div className="bp-container padding--top--lg padding--bottom--xl">
          <div className="row">
            <LeftNav dirData={dirData} fileName={fileName} />
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
  dirData: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
}

export default LeftNavPage
