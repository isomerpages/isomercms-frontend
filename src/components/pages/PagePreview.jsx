import PropTypes from "prop-types"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import CollectionPageTemplate from "templates/pages/CollectionPageTemplate"
import PageTemplate from "templates/pages/PageTemplate"
import ResourcePageTemplate from "templates/pages/ResourcePageTemplate"

const PagePreview = ({ pageParams, chunk, dirData, title }) => {
  const { collectionName, resourceRoomName, resourceCategoryName } = pageParams
  const RenderedPreview = () => {
    if (collectionName && dirData) {
      return (
        <CollectionPageTemplate
          chunk={chunk}
          dirData={dirData}
          pageParams={pageParams}
          title={title}
        />
      )
    }

    if (resourceRoomName && resourceCategoryName) {
      return (
        <ResourcePageTemplate
          chunk={chunk}
          pageParams={pageParams}
          title={title}
        />
      )
    }

    return <PageTemplate chunk={chunk} title={title} pageParams={pageParams} />
  }

  return (
    <div className={editorStyles.pageEditorMain}>
      <RenderedPreview />
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
  }).isRequired,
  title: PropTypes.string.isRequired,
  chunk: PropTypes.string.isRequired,
  dirData: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default PagePreview
