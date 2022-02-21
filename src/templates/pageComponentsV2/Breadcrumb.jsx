import PropTypes from "prop-types"

import { deslugifyDirectory } from "utils"

const BreadCrumbItem = ({ itemName }) => (
  <li>
    <small>
      <a>{itemName.toUpperCase()}</a>
    </small>
  </li>
)

const Breadcrumb = ({
  title,
  pageParams: {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
  },
}) => (
  <nav className="bp-breadcrumb" aria-label="breadcrumbs">
    <ul>
      <BreadCrumbItem itemName="Home" />
      {resourceRoomName ? (
        <BreadCrumbItem itemName={deslugifyDirectory(resourceRoomName)} />
      ) : null}
      {resourceCategoryName ? (
        <BreadCrumbItem itemName={deslugifyDirectory(resourceCategoryName)} />
      ) : null}
      {collectionName ? (
        <BreadCrumbItem itemName={deslugifyDirectory(collectionName)} />
      ) : null}
      {subCollectionName ? (
        <BreadCrumbItem itemName={deslugifyDirectory(subCollectionName)} />
      ) : null}
      <BreadCrumbItem itemName={title} />
    </ul>
  </nav>
)

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  pageParams: PropTypes.shape({
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    resourceRoomName: PropTypes.string,
    resourceCategoryName: PropTypes.string,
  }),
}

export default Breadcrumb
