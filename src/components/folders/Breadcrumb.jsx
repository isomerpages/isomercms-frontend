import { Link } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { deslugifyDirectory, isLastItem } from "utils"

const Arrowed = ({ children }) => (
  <>
    {children}
    <span className={elementStyles.arrowItem}>{">"}</span>
  </>
)

const BreadcrumbItem = ({ item, isLast, link, onClick }) => {
  if (isLast) {
    return <u>{item}</u>
  }

  const InnerItem = () => {
    if (link) {
      return <Link to={link}>{item}</Link>
    }

    if (onClick) {
      return (
        <button type="button" onClick={onClick}>
          {item}
        </button>
      )
    }

    return <span>{item}</span>
  }

  return (
    <Arrowed>
      <InnerItem />
    </Arrowed>
  )
}

const Breadcrumb = ({ params, title, isLink }) => {
  const {
    siteName,
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
    mediaRoom,
    mediaDirectoryName,
  } = params
  const newParams = { ...params, fileName: title }
  return (
    <div className={elementStyles.breadcrumb}>
      <BreadcrumbItem
        item="Workspace"
        isLast={isLastItem("siteName", newParams)}
        link={isLink && `/sites/${siteName}/workspace`}
      />
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
          link={isLink && `/sites/${siteName}/resourceRoom/${resourceRoomName}`}
        />
      ) : null}
      {resourceCategoryName ? (
        <BreadcrumbItem
          item={deslugifyDirectory(resourceCategoryName)}
          isLast={isLastItem("resourceCategoryName", newParams)}
          link={
            isLink &&
            `/sites/${siteName}/resourceRoom/${resourceRoomName}/resourceCategory/${resourceCategoryName}`
          }
        />
      ) : null}
      {mediaDirectoryName
        ? mediaDirectoryName.split("/").map((dir, idx) => (
            <BreadcrumbItem
              item={deslugifyDirectory(dir)}
              isLast={
                idx === mediaDirectoryName.split("/").length - 1 &&
                isLastItem("mediaDirectoryName", newParams)
              }
              link={
                isLink &&
                `/sites/${siteName}/media/${mediaRoom}/mediaDirectory/${encodeURIComponent(
                  mediaDirectoryName
                    .split("/")
                    .slice(0, idx + 1)
                    .join("/")
                )}`
              }
            />
          ))
        : null}
      {title ? (
        <BreadcrumbItem
          item={title}
          isLast={isLastItem("fileName", newParams)}
        />
      ) : null}
      <br />
      <br />
    </div>
  )
}

export { Breadcrumb, BreadcrumbItem }
