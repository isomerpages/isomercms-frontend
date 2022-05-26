import { Box, Flex } from "@chakra-ui/react"
import { Button, Textarea } from "@opengovsg/design-system-react"
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
    <Box mt={4}>
      <h6> Operating Hours </h6>
      {operatingHours &&
        operatingHours.map((operations, operationsIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={operationsIndex}>
            <Flex>
              <Box w="50%" pr={1}>
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
              </Box>
              <Box w="50%" pl={1}>
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
              </Box>
            </Flex>
            <Box>
              <FormContext hasError={!!errors[operationsIndex].description}>
                <FormTitle>Description</FormTitle>
                <Textarea
                  placeholder="Description"
                  id={`${sectionId}-${cardIndex}-operating_hours-${operationsIndex}-description`}
                  value={operations.description}
                  onChange={onFieldChange}
                />
                <FormError>{errors[operationsIndex].description}</FormError>
              </FormContext>
              <Button
                my="24px"
                colorScheme="danger"
                isFullWidth
                id={`${sectionId}-${cardIndex}-remove_operating_hours-${operationsIndex}`}
                onClick={onFieldChange}
              >
                Delete operating hours
              </Button>
            </Box>
          </Box>
        ))}
      <Box mt={3}>
        {operatingHours.length < DEFAULT_NUM_OPERATING_FIELDS ? (
          <Button
            isFullWidth
            onClick={onFieldChange}
            id={`${sectionId}-${cardIndex}-add_operating_hours`}
          >
            Add operating hours
          </Button>
        ) : (
          <p className={elementStyles.formLabel}>
            {" "}
            Maximum 5 operating hours fields
          </p>
        )}
      </Box>
    </Box>
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
  const errorMessage = getErrorMessage(errors)
  return (
    <FormContext hasError={!!errorMessage}>
      <FormTitle>{title}</FormTitle>
      {address.map((
        addressValue,
        addressIndex // sets default address length
      ) => (
        <Box py={1}>
          <FormField
            placeholder={title}
            id={`${sectionId}-${cardIndex}-address-${addressIndex}`}
            value={addressValue}
            onChange={onFieldChange}
          />
        </Box>
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
