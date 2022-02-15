import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import React from "react"

/* eslint
  react/no-array-index-key: 0
 */

const HeroButton = ({ button, url, sectionIndex, onFieldChange, errors }) => (
  <>
    <FormContext hasError={!!errors.button}>
      <FormTitle>Hero button</FormTitle>
      <FormField
        placeholder="Hero button"
        id={`section-${sectionIndex}-hero-button`}
        value={button}
        onChange={onFieldChange}
      />
      <FormError>{errors.button}</FormError>
    </FormContext>
    <FormContext hasError={!!errors.url}>
      <FormTitle>Hero button URL</FormTitle>
      <FormField
        placeholder="Insert permalink or external URL"
        id={`section-${sectionIndex}-hero-url`}
        value={url}
        onChange={onFieldChange}
      />
      <FormError>{errors.url}</FormError>
    </FormContext>
  </>
)

export default HeroButton

HeroButton.propTypes = {
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    button: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}
