import React from "react"
import PropTypes from "prop-types"

const BreadCrumbItem = ({ itemName }) => (
  <li>
    <small>
      <a>{itemName.toUpperCase()}</a>
    </small>
  </li>
)

const BreadcrumbV2 = ({
  title,
  collectionName,
  subCollectionName,
  resourceRoomName,
  resourceCategoryName,
}) => (
  <nav className="bp-breadcrumb" aria-label="breadcrumbs">
    <ul>
      <BreadCrumbItem itemName="Home" />
      {resourceRoomName ? <BreadCrumbItem itemName={resourceRoomName} /> : null}
      {resourceCategoryName ? (
        <BreadCrumbItem itemName={resourceCategoryName} />
      ) : null}
      {collectionName ? <BreadCrumbItem itemName={collectionName} /> : null}
      {subCollectionName ? (
        <BreadCrumbItem itemName={subCollectionName} />
      ) : null}
      <BreadCrumbItem itemName={title} />
    </ul>
  </nav>
)

BreadcrumbV2.propTypes = {
  title: PropTypes.string.isRequired,
  collectionName: PropTypes.string,
  subCollectionName: PropTypes.string,
  resourceRoomName: PropTypes.string,
  resourceCategoryName: PropTypes.string,
}

export default BreadcrumbV2
