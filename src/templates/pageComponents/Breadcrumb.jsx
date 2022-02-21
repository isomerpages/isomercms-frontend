import PropTypes from "prop-types"

const Breadcrumb = ({ title, collection, resourceRoomName }) => (
  <nav className="bp-breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <small>
          <a>HOME</a>
        </small>
      </li>
      {resourceRoomName ? (
        <li>
          <small>
            <a>{resourceRoomName.toUpperCase()}</a>
          </small>
        </li>
      ) : null}
      {collection ? (
        <li>
          <small>
            <a>{collection.toUpperCase()}</a>
          </small>
        </li>
      ) : null}
      <li>
        <small>
          <a>{title.toUpperCase()}</a>
        </small>
      </li>
    </ul>
  </nav>
)

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string,
}

export default Breadcrumb
