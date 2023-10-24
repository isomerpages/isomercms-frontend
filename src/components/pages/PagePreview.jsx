import { Box } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"

import CollectionPageTemplate from "templates/pages/CollectionPageTemplate"
import PageTemplate from "templates/pages/PageTemplate"
import ResourcePageTemplate from "templates/pages/ResourcePageTemplate"

import { getDecodedParams } from "utils"

const PagePreview = ({ title }) => {
  const params = useParams()
  const pageParams = getDecodedParams(params)
  const { collectionName, resourceRoomName, resourceCategoryName } = pageParams
  const RenderedPreview = () => {
    if (collectionName) {
      return <CollectionPageTemplate pageParams={pageParams} title={title} />
    }

    if (resourceRoomName && resourceCategoryName) {
      return <ResourcePageTemplate pageParams={pageParams} title={title} />
    }

    return <PageTemplate title={title} pageParams={pageParams} />
  }

  return (
    <Box w="100%" h="100%" bg="white" overflowY="auto">
      <RenderedPreview />
    </Box>
  )
}

PagePreview.propTypes = {
  title: PropTypes.string.isRequired,
}

export default PagePreview
