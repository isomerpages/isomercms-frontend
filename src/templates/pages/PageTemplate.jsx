import React from "react"
import PropTypes from "prop-types"
import PageHeaderV2 from "../pageComponents/PageHeaderV2"

import { prettifyPageFileName } from "../../utils"

const PageTemplate = ({ chunk, fileName }) => (
  <div>
    <PageHeaderV2 title={prettifyPageFileName(fileName)} />
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

PageTemplate.propTypes = {
  chunk: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
}

export default PageTemplate
