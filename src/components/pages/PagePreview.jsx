import PropTypes from "prop-types"
import React from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import CollectionPageTemplate from "templates/pages/CollectionPageTemplate"
import PageTemplate from "templates/pages/PageTemplate"
import ResourcePageTemplate from "templates/pages/ResourcePageTemplate"

const PagePreview = ({ pageParams, chunk, dirData, title }) => {
  const {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
  } = pageParams
  return (
    <div className={editorStyles.pageEditorMain}>
      {collectionName && dirData ? (
        <CollectionPageTemplate
          chunk={chunk}
          dirData={dirData}
          pageParams={pageParams}
          title={title}
        />
      ) : resourceRoomName && resourceCategoryName ? (
        <ResourcePageTemplate
          chunk={chunk}
          pageParams={pageParams}
          title={title}
        />
      ) : (
        <PageTemplate chunk={chunk} title={title} pageParams={pageParams} />
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
