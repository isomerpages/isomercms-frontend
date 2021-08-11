import React from "react"
import PropTypes from "prop-types"
import BreadcrumbV2 from "./BreadcrumbV2"

const PageHeaderV2 = ({
  title,
  date,
  collectionName,
  subCollectionName,
  resourceCategoryName,
  resourceRoomName,
}) => (
  <section
    id="display-header"
    className={`bp-section ${
      resourceCategoryName && resourceRoomName
        ? "bg-secondary"
        : "is-small bp-section-pagetitle"
    }`}
  >
    <div className="bp-container page-header-container">
      <div className="row">
        <div className="col">
          <BreadcrumbV2
            title={title}
            collectionName={collectionName}
            subCollectionName={subCollectionName}
            resourceRoomName={resourceRoomName}
            resourceCategoryName={resourceCategoryName}
          />
        </div>
      </div>
    </div>
    <div className="bp-container page-header-container">
      <div className="row">
        <div className="col">
          <h1 className="has-text-white">
            <b>
              {title
                .split(" ")
                .map(
                  (string) => string.charAt(0).toUpperCase() + string.slice(1)
                )
                .join(" ")}
            </b>
          </h1>
        </div>
      </div>
    </div>
    {date && (
      <div className="bp-container page-header-container">
        <div className="row">
          <div className="col">
            <p className="has-text-white">{date}</p>
          </div>
        </div>
      </div>
    )}
  </section>
)

PageHeaderV2.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string,
}

export default PageHeaderV2
