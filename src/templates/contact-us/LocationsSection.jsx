import { sanitizeUrl } from "@braintree/sanitize-url"
import PropTypes from "prop-types"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "utils"

const LocationHours = ({ operatingHours }) => (
  <div className={getClassNames(editorStyles, ["col", "is-6"])}>
    {operatingHours &&
      operatingHours.map((operation) => {
        return (
          <p className={getClassNames(editorStyles, ["margin--top--none"])}>
            <b>{operation.days}</b>:&nbsp;{operation.time}
            <br />
            {operation.description}
          </p>
        )
      })}
  </div>
)

const LocationAddress = ({ location }) => (
  <div className={getClassNames(editorStyles, ["col", "is-6"])}>
    <div>
      {location.address.map((value) => (
        <p
          className={getClassNames(editorStyles, [
            "content",
            "margin--top--none",
            "margin--bottom--none",
          ])}
        >
          {value}
        </p>
      ))}
      <a
        href={
          location.maps_link
            ? sanitizeUrl(location.maps_link)
            : sanitizeUrl(
                `https://maps.google.com/?q=${location.address
                  .join("+")
                  .replace(/\s/g, "+")}`
              )
        }
        onClick={(event) => event.preventDefault()}
        className={getClassNames(editorStyles, [
          "bp-sec-button",
          "margin--top",
          "has-text-secondary",
        ])}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div>
          <span>VIEW MAP</span>
          <i
            className={getClassNames(editorStyles, [
              "sgds-icon",
              "sgds-icon-arrow-right",
            ])}
            aria-hidden="true"
          />
        </div>
      </a>
    </div>
  </div>
)

const Location = forwardRef(({ location }, ref) => (
  <div
    className={getClassNames(editorStyles, [
      "row",
      "is-multiline",
      "margin--bottom",
    ])}
    ref={ref}
  >
    {location.address && location.title && (
      <div
        className={getClassNames(editorStyles, [
          "col",
          "is-6",
          "padding--bottom--none",
        ])}
      >
        <h5 className="has-text-secondary">
          <b>{location.title}</b>
        </h5>
      </div>
    )}

    <div
      className={getClassNames(editorStyles, [
        "col",
        "is-6",
        "padding--bottom--none",
        "is-hidden-mobile",
      ])}
    >
      {location.operating_hours && location.operating_hours.length ? (
        <h5 className="has-text-secondary">
          <b>Operating Hours</b>
        </h5>
      ) : null}
    </div>
    <LocationAddress location={location} />
    <LocationHours operatingHours={location.operating_hours} />
  </div>
))

const TemplateLocationsSection = forwardRef(
  ({ locations, scrollRefs }, ref) => (
    <div ref={ref}>
      {locations && (
        <>
          {locations.map((location, i) => (
            <Location location={location} ref={scrollRefs[i]} />
          ))}
        </>
      )}
    </div>
  )
)

LocationAddress.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string),
    maps_link: PropTypes.string,
  }),
}

LocationHours.propTypes = {
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}

Location.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    operating_hours: PropTypes.arrayOf(
      PropTypes.shape({
        days: PropTypes.string,
        time: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    maps_link: PropTypes.string,
  }),
}

TemplateLocationsSection.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        title: PropTypes.string,
        operating_hours: PropTypes.arrayOf(
          PropTypes.shape({
            days: PropTypes.string,
            time: PropTypes.string,
            description: PropTypes.string,
          })
        ),
        maps_link: PropTypes.string,
      }),
    })
  ),
}

export default TemplateLocationsSection
