export const getPageApiEndpointV2 = ({
  siteName,
  collectionName,
  subCollectionName,
  resourceCategoryName,
  fileName,
}) => {
  if (subCollectionName && collectionName) {
    return `${
      process.env.REACT_APP_BACKEND_URL_V2
    }/sites/${siteName}/collections/${collectionName}/subcollections/${encodeURIComponent(
      subCollectionName
    )}/pages/${encodeURIComponent(fileName)}`
  }
  if (collectionName) {
    return `${
      process.env.REACT_APP_BACKEND_URL_V2
    }/sites/${siteName}/collections/${collectionName}/pages/${encodeURIComponent(
      fileName
    )}`
  }
  if (resourceCategoryName) {
    return `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/resources/${resourceCategoryName}/pages/${fileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/pages/${fileName}`
}

export const getCreatePageApiEndpointV2 = ({
  siteName,
  collectionName,
  subCollectionName,
  resourceCategoryName,
}) => {
  if (subCollectionName && collectionName) {
    return `${
      process.env.REACT_APP_BACKEND_URL_V2
    }/sites/${siteName}/collections/${collectionName}/subcollections/${encodeURIComponent(
      subCollectionName
    )}/pages`
  }
  if (collectionName) {
    return `${
      process.env.REACT_APP_BACKEND_URL_V2
    }/sites/${siteName}/collections/${encodeURIComponent(collectionName)}/pages`
  }
  if (resourceCategoryName) {
    return `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/resources/${resourceCategoryName}/pages`
  }
  return `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/pages`
}
