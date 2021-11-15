import React from "react"
import { Link } from "react-router-dom"

import { deslugifyDirectory, isLastItem } from "utils"

const BreadcrumbItem = ({ item, isLast, link }) => (
  <>
    {link && !isLast ? (
      <Link to={link}>{item}</Link>
    ) : !isLast ? (
      <span>{item}</span>
    ) : (
      // underline last item
      <span>
        <u className="ml-1">{item}</u>
      </span>
    )}
    {isLast ? "" : " > "}
  </>
)

const Breadcrumb = ({ params, title, isLink }) => {
  const {
    siteName,
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
  } = params
  const newParams = { ...params, fileName: title }
  return (
    <span>
      {
        <BreadcrumbItem
          item="Workspace"
          isLast={isLastItem("siteName", newParams)}
          link={isLink && `/sites/${siteName}/workspace`}
        />
      }
      {collectionName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(collectionName)}
          isLast={isLastItem("collectionName", newParams)}
          link={isLink && `/sites/${siteName}/folders/${collectionName}`}
        />
      ) : null}
      {subCollectionName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(subCollectionName)}
          isLast={isLastItem("subCollectionName", newParams)}
          link={
            isLink &&
            `/sites/${siteName}/folders/${collectionName}/subfolders/${subCollectionName}`
          }
        />
      ) : null}
      {resourceRoomName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(resourceRoomName)}
          isLast={isLastItem("resourceRoomName", newParams)}
          link={
            isLink && `/sites/${siteName}/resourceRoomName/${resourceRoomName}`
          }
        />
      ) : null}
      {resourceCategoryName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(resourceCategoryName)}
          isLast={isLastItem("resourceCategoryName", newParams)}
          link={
            isLink &&
            `/sites/${siteName}/resourceRoomName/${resourceRoomName}/resources/${resourceCategoryName}`
          }
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
