import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import _ from "lodash"
import FormField from "../FormField"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import { isEmpty } from "../../utils"

const DEFAULT_NUM_OPERATING_FIELDS = 5

const LocationHoursFields = ({
  operatingHours,
  cardIndex,
  onFieldChange,
  errors,
  sectionId,
}) => {
  return (
    <div className="mt-4">
      <h6> Operating Hours </h6>
      {operatingHours &&
        operatingHours.map((operations, operationsIndex) => (
          <div className="mb-1" key={operationsIndex}>
            <div className="d-flex flex-row">
              <div className="w-50 pr-1">
                <FormField
                  title="Days"
                  id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-days`}
                  value={operations.days}
                  onFieldChange={onFieldChange}
                  errorMessage={errors[operationsIndex].days}
                />
              </div>
              <div className="w-50 pl-1">
                <FormField
                  title="Hours"
                  id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-time`}
                  value={operations.time}
                  onFieldChange={onFieldChange}
                  errorMessage={errors[operationsIndex].time}
                />
              </div>
            </div>
            <div>
              <FormField
                title="Description"
                id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-description`}
                value={operations.description}
                onFieldChange={onFieldChange}
                errorMessage={errors[operationsIndex].description}
              />
            </div>
            <a
              className={elementStyles.formFixedText}
              id={`${sectionId}-${cardIndex}-remove_operating_hours-${operationsIndex}`}
              href="#"
              onClick={onFieldChange}
            >
              Remove
            </a>
          </div>
        ))}
      <div className="mt-3">
        {operatingHours.length < DEFAULT_NUM_OPERATING_FIELDS ? (
          <a
            className={elementStyles.formLabel}
            id={`${sectionId}-${cardIndex}-add_operating_hours`}
            href="#"
            onClick={onFieldChange}
          >
            Add operating hours
          </a>
        ) : (
          <p className={elementStyles.formLabel}>
            {" "}
            Maximum 5 operating hours fields
          </p>
        )}
      </div>
    </div>
  )
}

const LocationAddressFields = ({
  title,
  address,
  cardIndex,
  onFieldChange,
  errors,
  sectionId,
}) => {
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let newErrorMessage = ""
    if (!isEmpty(errors)) {
      if (errors.length === 1) {
        newErrorMessage = errors[0]
      } else {
        errors.forEach((error, i) => {
          newErrorMessage += error ? `Line ${i + 1}: ${error} ` : ""
        })
      }
    }
    setErrorMessage(newErrorMessage)
  }, [errors])
  return (
    <>
      {address.map((
        addressValue,
        addressIndex // sets default address length
      ) => (
        <div className="py-1" key={addressIndex}>
          <FormField
            title={addressIndex === 0 ? title : null} // title appears above first field
            id={`${sectionId}-${cardIndex}-address-${addressIndex}`}
            value={addressValue}
            onFieldChange={onFieldChange}
            hasError={errorMessage}
            errorMessage={
              errorMessage && addressIndex === 2 ? errorMessage : null
            } // error appears below last field
          />
        </div>
      ))}
    </>
  )
}

export { LocationHoursFields, LocationAddressFields }

LocationHoursFields.propTypes = {
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  cardIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  sectionId: PropTypes.string,
}

LocationAddressFields.propTypes = {
  title: PropTypes.string,
  address: PropTypes.arrayOf(PropTypes.string),
  cardIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  sectionId: PropTypes.string,
}
