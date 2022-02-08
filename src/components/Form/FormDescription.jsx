import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormDescription = ({ children }) => (
  <p className={elementStyles.formDescription}>{children}</p>
)

FormDescription.propTypes = {
  children: PropTypes.node,
}

FormDescription.defaultProps = {
  children: null,
}

export default FormDescription
