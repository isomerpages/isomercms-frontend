import React from "react"
import PropTypes from "prop-types"

import CollectionPageTemplate from "../../templates/pages/CollectionPageTemplate"
import ResourcePageTemplate from "../../templates/pages/ResourcePageTemplate"
import PageTemplate from "../../templates/pages/PageTemplate"

import editorStyles from "../../styles/isomer-cms/pages/Editor.module.scss"

const PagePreview = ({ pageParams, chunk, dirData }) => {
  const {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
    fileName,
  } = pageParams
  return (
    <div className={editorStyles.pageEditorMain}>
      {collectionName && dirData ? (
        <CollectionPageTemplate
          chunk={chunk}
          dirData={dirData}
          pageParams={pageParams}
        />
      ) : resourceRoomName && resourceCategoryName ? (
        <ResourcePageTemplate
          chunk={chunk}
          fileName={fileName}
          pageParams={pageParams}
        />
      ) : (
        <PageTemplate chunk={chunk} fileName={fileName} />
      )}
    </div>
  )
}

PagePreview.propTypes = {
  pageParams: PropTypes.shape({
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    resourceRoomName: PropTypes.string,
    resourceCategoryName: PropTypes.string,
    fileName: PropTypes.string.isRequired,
  }),
  chunk: PropTypes.string,
  dirData: PropTypes.arrayOf(PropTypes.string.isRequired),
}

export default PagePreview
