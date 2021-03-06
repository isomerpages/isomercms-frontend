import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import FormField from "../FormField"
import { LocationHoursFields, LocationAddressFields } from "./LocationFields"
import { isEmpty } from "../../utils"

/* eslint
  react/no-array-index-key: 0
 */

const EditorLocationSection = ({
  title,
  address,
  operatingHours,
  mapUrl,
  cardIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  cardErrors,
  sectionId,
}) => (
  <div
    className={`${elementStyles.card} ${
      !shouldDisplay && !isEmpty(cardErrors) ? elementStyles.error : ""
    } move`}
  >
    <div className={elementStyles.cardHeader}>
      <h2>{title}</h2>
      <button
        type="button"
        id={`${sectionId}-${cardIndex}`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`${sectionId}-${cardIndex}-icon`}
        />
      </button>
    </div>
    {shouldDisplay ? (
      <>
        <div className={elementStyles.cardContent}>
          <FormField
            title="Title"
            id={`${sectionId}-${cardIndex}-title`}
            value={title}
            onFieldChange={onFieldChange}
            errorMessage={cardErrors.title}
          />
          <LocationAddressFields
            title="Address"
            cardIndex={cardIndex}
            address={address}
            onFieldChange={onFieldChange}
            errors={cardErrors.address}
            sectionId={sectionId}
          />
          <FormField
            title="Map url"
            id={`${sectionId}-${cardIndex}-maps_link`}
            value={mapUrl}
            onFieldChange={onFieldChange}
            errorMessage={cardErrors.maps_link}
          />
          <span className={elementStyles.info}>
            Note: If left blank, map url is automatically generated from Address
            fields
          </span>
          <LocationHoursFields
            operatingHours={operatingHours}
            onFieldChange={onFieldChange}
            cardIndex={cardIndex}
            errors={cardErrors.operating_hours}
            sectionId={sectionId}
          />
        </div>
        <div className={`${elementStyles.inputGroup} pt-5`}>
          <button
            type="button"
            id={`${sectionId}-${cardIndex}`}
            className={`btn-block ${elementStyles.warning}`}
            onClick={deleteHandler}
          >
            Delete section
          </button>
        </div>
      </>
    ) : null}
  </div>
)

export default EditorLocationSection

EditorLocationSection.propTypes = {
  title: PropTypes.string,
  address: PropTypes.arrayOf(PropTypes.string),
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  mapUrl: PropTypes.string,
  cardIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  cardErrors: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
    operatingHours: PropTypes.arrayOf(
      PropTypes.shape({
        days: PropTypes.string,
        time: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    mapUrl: PropTypes.string,
  }),
  sectionId: PropTypes.string,
}
