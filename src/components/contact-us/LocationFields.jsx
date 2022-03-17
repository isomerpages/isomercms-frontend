import { FormContext } from "components/Form"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import _ from "lodash"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { isEmpty } from "utils"

const DEFAULT_NUM_OPERATING_FIELDS = 5

const getErrorMessage = (errors) => {
  if (isEmpty(errors)) {
    return ""
  }

  if (errors.length === 1) {
    return _.head(errors)
  }

  return errors
    .filter((err) => !!err)
    .map((err, idx) => {
      return `Line ${idx + 1}: ${err}`
    })
    .join("\n")
}

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
          // eslint-disable-next-line react/no-array-index-key
          <div className="mb-1" key={operationsIndex}>
            <div className="d-flex flex-row">
              <div className="w-50 pr-1">
                <FormContext hasError={!!errors[operationsIndex].days}>
                  <FormTitle>Days</FormTitle>
                  <FormField
                    placeholder="Days"
                    id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-days`}
                    value={operations.days}
                    onChange={onFieldChange}
                  />
                  <FormError>{errors[operationsIndex].days}</FormError>
                </FormContext>
              </div>
              <div className="w-50 pl-1">
                <FormContext hasError={!!errors[operationsIndex].time}>
                  <FormTitle>Hours</FormTitle>
                  <FormField
                    placeholder="Hours"
                    id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-time`}
                    value={operations.time}
                    onChange={onFieldChange}
                  />
                  <FormError>{errors[operationsIndex].time}</FormError>
                </FormContext>
              </div>
            </div>
            <div>
              <FormContext hasError={!!errors[operationsIndex].description}>
                <FormTitle>Description</FormTitle>
                <FormField
                  placeholder="Description"
                  id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-description`}
                  value={operations.description}
                  onChange={onFieldChange}
                />
                <FormError>{errors[operationsIndex].description}</FormError>
              </FormContext>
            </div>
            <button
              className={`${elementStyles.formFixedText} ${elementStyles.textButton}`}
              id={`${sectionId}-${cardIndex}-remove_operating_hours-${operationsIndex}`}
              type="button"
              onClick={onFieldChange}
              style={{ font: "none" }}
            >
              Remove
            </button>
          </div>
        ))}
      <div className="mt-3">
        {operatingHours.length < DEFAULT_NUM_OPERATING_FIELDS ? (
          <button onClick={onFieldChange} type="button">
            <button
              className={`${elementStyles.formLabel} ${elementStyles.textButton}`}
              id={`${sectionId}-${cardIndex}-add_operating_hours`}
              type="button"
              style={{
                fontSize: "16px",
              }}
            >
              Add operating hours
            </button>
          </button>
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
  console.log("ERRORS: ", errors)
  const errorMessage = getErrorMessage(errors)
  return (
    <FormContext hasError={!!errorMessage}>
      <FormTitle>{title}</FormTitle>
      {address.map((
        addressValue,
        addressIndex // sets default address length
      ) => (
        <div className="py-1">
          <FormField
            placeholder={title}
            id={`${sectionId}-${cardIndex}-address-${addressIndex}`}
            value={addressValue}
            onChange={onFieldChange}
          />
        </div>
      ))}
      <FormError>{errorMessage}</FormError>
    </FormContext>
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
