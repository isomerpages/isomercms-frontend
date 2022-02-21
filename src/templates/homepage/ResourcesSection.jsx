import PropTypes from "prop-types"
import { forwardRef } from "react"

import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

/* eslint
  react/no-array-index-key: 0
 */

const ResourcePost = () => (
  <div className="col">
    <div className="is-media-card">
      <div className="media-card-plain bg-media-color-0 padding--lg">
        <div>
          <small className="has-text-white padding--bottom">
            DEMO CATEGORY
          </small>
          <h4
            className="has-text-white padding--bottom--lg"
            style={{ lineHeight: "2.25em" }}
          >
            <b>TITLE</b>
          </h4>
        </div>
        <div className="is-fluid padding--top--md description">
          <small className="has-text-white">DATE</small>
        </div>
      </div>
    </div>
  </div>
)

const TemplateResourceSection = (
  { title, subtitle, button, sectionIndex },
  ref
) => (
  <div ref={ref}>
    <section
      className={`bp-section ${
        sectionIndex % 2 === 1 ? "bg-newssection" : null
      }`}
    >
      <div className="bp-container">
        <div className="row">
          <div className="col is-half is-offset-one-quarter has-text-centered padding--top--lg">
            {/* Subtitle */}
            {subtitle ? (
              <p className="padding--bottom eyebrow is-uppercase">{subtitle}</p>
            ) : null}
            {/* Title */}
            {title ? (
              <h1 className="has-text-secondary padding--bottom">
                <b>{title}</b>
              </h1>
            ) : null}
          </div>
        </div>
        <div className="watermark-container">
          <div className="row padding--bottom resource-sample-mask">
            <ResourcePost />
            <ResourcePost />
            <ResourcePost />
          </div>
          <div className="d-flex flex-column watermark-text">
            <span className="watermark-text-title">PLACEHOLDER MEDIA</span>
            <span className="watermark-text-content">
              Your 3 latest resources will be displayed here.
            </span>
            <span className="watermark-text-content">
              You may change the resources displayed by changing the date of the
              resource in the resources section.
            </span>
          </div>
        </div>
        <div className="row has-text-centered margin--top padding--bottom--lg">
          <div className="col is-offset-one-third is-one-third">
            <div className="bp-sec-button">
              <div className="d-flex align-items-center justify-content-center">
                <span>{button || "MORE"}</span>
                <i
                  className="sgds-icon sgds-icon-arrow-right is-size-4"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

TemplateResourceSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  button: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
}

TemplateResourceSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  button: undefined,
}

export default forwardRef(TemplateResourceSection)
