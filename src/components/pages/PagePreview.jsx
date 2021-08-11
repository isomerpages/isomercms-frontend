import React from "react"
import PropTypes from "prop-types"

import CollectionPageTemplate from "../../templates/pages/CollectionPageTemplate"
import ResourcePageTemplate from "../../templates/pages/ResourcePageTemplate"
import PageTemplate from "../../templates/pages/PageTemplate"

import editorStyles from "../../styles/isomer-cms/pages/Editor.module.scss"

const PagePreview = ({
  pageParams: {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
    fileName,
  },
  chunk,
  dirData,
}) => (
  <div className={editorStyles.pageEditorMain}>
    {collectionName && dirData ? (
      <CollectionPageTemplate
        chunk={chunk}
        dirData={dirData}
        fileName={fileName}
        collectionName={collectionName}
        subCollectionName={subCollectionName}
      />
    ) : resourceRoomName && resourceCategoryName ? (
      <ResourcePageTemplate
        chunk={chunk}
        fileName={fileName}
        resourceRoomName={resourceRoomName}
        resourceCategoryName={resourceCategoryName}
      />
    ) : (
      <PageTemplate chunk={chunk} fileName={fileName} />
    )}
  </div>
)

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
