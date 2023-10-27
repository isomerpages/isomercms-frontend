import { Box } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import CollectionPageTemplate from "templates/pages/CollectionPageTemplate"
import PageTemplate from "templates/pages/PageTemplate"
import ResourcePageTemplate from "templates/pages/ResourcePageTemplate"

import { getDecodedParams } from "utils"

const PagePreview = ({ title, chunk, ...rest }) => {
  const params = useParams()
  const pageParams = getDecodedParams(params)
  const { collectionName, resourceRoomName, resourceCategoryName } = pageParams
  const RenderedPreview = () => {
    if (collectionName) {
      return (
        <CollectionPageTemplate
          chunk={chunk}
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
    <Box
      w="100%"
      h="100%"
      maxH="100vh"
      bg="white"
      overflowY="auto"
      className={editorStyles.pageEditorMain}
      {...rest}
    >
      <RenderedPreview />
    </Box>
  )
}

PagePreview.propTypes = {
  title: PropTypes.string.isRequired,
  chunk: PropTypes.string.isRequired,
}

export default PagePreview
