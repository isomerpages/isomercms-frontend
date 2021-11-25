import PropTypes from "prop-types"
import React from "react"

import Breadcrumb from "templates/pageComponents/Breadcrumb"

const TemplateContactUsHeader = React.forwardRef(({ agencyName }, ref) => (
  <section className="bp-section" ref={ref}>
    <div className="bp-container">
      <div className="row is-inverted">
        <div className="col is-8 is-offset-2">
          <Breadcrumb title="Contact Us" />
        </div>
      </div>
      <div className="row">
        <div className="col is-8 is-offset-2">
          <h1 className="display has-text-weight-semibold">
            Get in touch with
            <br />
            <span className="display has-text-secondary">{agencyName}</span>
          </h1>
        </div>
      </div>
    </div>
  </section>
))

TemplateContactUsHeader.propTypes = {
  agencyName: PropTypes.string,
}

export default TemplateContactUsHeader
