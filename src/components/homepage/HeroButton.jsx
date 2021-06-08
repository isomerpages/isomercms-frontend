import React from "react"

import PropTypes from "prop-types"

import FormField from "@components/FormField"

/* eslint
  react/no-array-index-key: 0
 */

const HeroButton = ({ button, url, sectionIndex, onFieldChange, errors }) => (
  <>
    <FormField
      title="Hero button"
      id={`section-${sectionIndex}-hero-button`}
      value={button}
      errorMessage={errors.button}
      isRequired={false}
      onFieldChange={onFieldChange}
    />
    <FormField
      title="Hero button URL"
      placeholder="Insert permalink or external URL"
      id={`section-${sectionIndex}-hero-url`}
      value={url}
      errorMessage={errors.url}
      isRequired={false}
      onFieldChange={onFieldChange}
    />
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
