// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

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
