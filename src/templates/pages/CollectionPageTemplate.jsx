import React from "react"
import PropTypes from "prop-types"
import _ from "lodash"
import PageHeaderV2 from "../pageComponents/PageHeaderV2"
import LeftNav from "../pageComponents/LeftNav"

import { prettifyPageFileName, deslugifyDirectory } from "../../utils"

const CollectionPageTemplate = ({
  chunk,
  dirData,
  fileName,
  collectionName,
  subCollectionName,
}) => {
  return (
    <div>
      <PageHeaderV2
        title={prettifyPageFileName(fileName)}
        collectionName={deslugifyDirectory(collectionName)}
        subCollectionName={
          subCollectionName ? deslugifyDirectory(subCollectionName) : ""
        }
      />
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

CollectionPageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  dirData: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  subCollectionName: PropTypes.string,
}

export default CollectionPageTemplate
