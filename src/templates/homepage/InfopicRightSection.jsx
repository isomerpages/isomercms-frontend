import PropTypes from "prop-types"
import { forwardRef } from "react"
import { useQuery } from "react-query"

import { fetchImageURL } from "utils"

/* eslint
  react/no-array-index-key: 0
 */

const TemplateInfopicRightSection = (
  {
    title,
    subtitle,
    description,
    button,
    sectionIndex,
    imageUrl,
    imageAlt,
    siteName,
  },
  ref
) => {
  const addDefaultSrc = (e) => {
    e.target.src = "/placeholder_no_image.png"
  }

  const { data: loadedImageURL, status } = useQuery(
    `${siteName}/${imageUrl}`,
    () => fetchImageURL(siteName, decodeURI(imageUrl)),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Never automatically refetch image unless query is invalidated
    }
  )

  return (
    <div ref={ref}>
      <section
        className={`bp-section ${
          sectionIndex % 2 === 1 ? "bg-newssection" : null
        }`}
      >
        <div className="bp-container">
          {/* For mobile */}
          <div className="row is-hidden-desktop is-hidden-tablet-only">
            <div className="col is-half padding--bottom">
              <p className="padding--bottom eyebrow is-uppercase">{subtitle}</p>
              <h1 className="has-text-secondary padding--bottom">
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div className="bp-sec-button margin--top padding--bottom">
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className="sgds-icon sgds-icon-arrow-right is-size-4"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="col is-half">
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
          </div>
          {/* For tablet */}
          <div className="row is-hidden-mobile is-hidden-desktop">
            <div className="col is-half is-half padding--top--xl padding--bottom--xl">
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
            <div className="col is-half">
              <p className="padding--bottom eyebrow is-uppercase">{subtitle}</p>
              <h1 className="has-text-secondary padding--bottom">
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div className="bp-sec-button margin--top padding--bottom">
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className="sgds-icon sgds-icon-arrow-right is-size-4"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* For desktop */}
          <div className="row is-hidden-mobile is-hidden-tablet-only">
            <div className="col is-half is-half padding--top--xl padding--bottom--xl">
              <img
                onError={addDefaultSrc}
                src={loadedImageURL}
                alt={imageAlt}
              />
            </div>
            <div className="col is-half padding--top--xl padding--bottom--xl padding--left--xl padding--right--xl">
              <p className="padding--bottom eyebrow is-uppercase">{subtitle}</p>
              <h1 className="has-text-secondary padding--bottom">
                <b>{title}</b>
              </h1>
              <p>{description}</p>
              <div className="bp-sec-button margin--top padding--bottom">
                {button ? (
                  <div>
                    <span>{button}</span>
                    <i
                      className="sgds-icon sgds-icon-arrow-right is-size-4"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default forwardRef(TemplateInfopicRightSection)

TemplateInfopicRightSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  siteName: PropTypes.string.isRequired,
}

TemplateInfopicRightSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  description: undefined,
}
