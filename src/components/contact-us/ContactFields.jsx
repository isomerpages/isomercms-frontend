import Dropdown from "components/Dropdown"
import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import InputMaskFormField from "components/InputMaskFormField"
import _ from "lodash"
import PropTypes from "prop-types"
import React, { useState } from "react"

const ContactFields = ({
  cardIndex,
  content,
  onFieldChange,
  errors,
  sectionId,
}) => {
  const [phoneFieldType, setPhoneFieldType] = useState(
    content[0].phone[0] === "1" ? "tollfree" : "local"
  )

  return (
    <div className="d-flex flex-column">
      <InputMaskFormField
        title="Phone"
        mask={phoneFieldType === "local" ? "+65 9999 9999" : "1 800 999 9999"}
        maskChar="_"
        alwaysShowMask={false}
        id={`${sectionId}-${cardIndex}-phone-0`}
        value={content[0].phone}
        onFieldChange={onFieldChange}
        errorMessage={errors[0].phone}
      />
      <Dropdown
        options={["Local", "Tollfree"]}
        defaultOption={_.upperFirst(phoneFieldType)}
        id="phone-field-type"
        onFieldChange={(e) => setPhoneFieldType(e.target.value)}
      />
      <FormContext hasError={!!errors[1].email}>
        <FormTitle>Email</FormTitle>
        <FormField
          placeholder="Email"
          id={`${sectionId}-${cardIndex}-email-1`}
          value={content[1].email}
          onChange={onFieldChange}
        />
        <FormError>{errors[1].email}</FormError>
      </FormContext>
      <FormContext hasError={!!errors[2].other}>
        <FormTitle>Others</FormTitle>
        <FormField
          placeholder="Others"
          id={`${sectionId}-${cardIndex}-other-2`}
          value={content[2].other}
          onChange={onFieldChange}
        />
        <FormError>{errors[2].other}</FormError>
      </FormContext>
    </div>
  )
}

export default ContactFields

ContactFields.propTypes = {
  cardIndex: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      phone: PropTypes.string,
    }),
    PropTypes.shape({
      email: PropTypes.string,
    }),
    PropTypes.shape({
      other: PropTypes.string,
    })
  ),
  onFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      phone: PropTypes.string,
    }),
    PropTypes.shape({
      email: PropTypes.string,
    }),
    PropTypes.shape({
      other: PropTypes.string,
    })
  ),
  sectionId: PropTypes.string,
}
