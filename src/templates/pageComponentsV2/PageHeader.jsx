import React from "react"
import PropTypes from "prop-types"
import Breadcrumb from "./Breadcrumb"

import { extractMetadataFromFilename } from "../../utils"

export const PageHeader = ({ pageParams, title }) => {
  const { resourceCategoryName, fileName } = pageParams
  const { date } = extractMetadataFromFilename({
    resourceCategoryName,
    fileName,
  })
  return (
    <>
      <div className="bp-container page-header-container">
        <div className="row">
          <div className="col">
            <Breadcrumb title={title} pageParams={pageParams} />
          </div>
        </div>
      </div>
      <div className="bp-container page-header-container">
        <div className="row">
          <div className="col">
            <h1 className="has-text-white">
              <b>{title}</b>
            </h1>
          </div>
        </div>
      </div>
      {date && (
        <div className="bp-container page-header-container">
          <div className="row">
            <div className="col">
              <p className="has-text-white">{date}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

PageHeader.propTypes = {
  pageParams: PropTypes.shape({
    fileName: PropTypes.string,
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    resourceCategoryName: PropTypes.string,
    resourceRoomName: PropTypes.string,
  }),
}
