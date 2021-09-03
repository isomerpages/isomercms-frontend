import React from "react"

import { deslugifyDirectory, isLastItem } from "../../utils"

const BreadcrumbItem = ({ item, isLast }) => (
  <span>
    {" > "}
    {isLast ? <u className="ml-1">{item}</u> : item}
  </span>
)

const Breadcrumb = ({ params, title }) => {
  const {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
  } = params
  const newParams = { ...params, fileName: title }
  return (
    <span>
      Workspace
      {collectionName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(collectionName)}
          isLast={isLastItem("collectionName", newParams)}
        />
      ) : null}
      {subCollectionName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(subCollectionName)}
          isLast={isLastItem("subCollectionName", newParams)}
        />
      ) : null}
      {resourceRoomName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(resourceRoomName)}
          isLast={isLastItem("resourceRoomName", newParams)}
        />
      ) : null}
      {resourceCategoryName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(resourceCategoryName)}
          isLast={isLastItem("resourceCategoryName", newParams)}
        />
      ) : null}
      {title ? (
        <BreadcrumbItem
          item={title}
          isLast={isLastItem("fileName", newParams)}
        />
      ) : null}
      <br />
      <br />
    </span>
  )
}

export default Breadcrumb
