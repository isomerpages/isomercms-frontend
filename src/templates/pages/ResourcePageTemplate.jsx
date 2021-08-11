import React from "react"
import PropTypes from "prop-types"
import PageHeaderV2 from "../pageComponents/PageHeaderV2"
import { retrieveResourceFileMetadata } from "../../utils"

const ResourcePageTemplate = ({
  chunk,
  fileName,
  resourceCategoryName,
  resourceRoomName,
}) => {
  const { title, date } = retrieveResourceFileMetadata(fileName)
  return (
    <div>
      <PageHeaderV2
        title={title}
        date={date}
        collection={deslugifyDirectory(resourceCategoryName)}
        resourceRoomName={deslugifyDirectory(resourceRoomName)}
      />
      <section className="bp-section">
        <div className="bp-container content padding--top--lg padding--bottom--xl">
          <div className="row">
            <div className="col is-8 is-offset-1-desktop is-12-touch print-content page-content-body">
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: chunk }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

ResourcePageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  resourceCategoryName: PropTypes.string.isRequired,
  resourceRoomName: PropTypes.string.isRequired,
}

export default ResourcePageTemplate
