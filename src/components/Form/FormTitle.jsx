import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormTitle = ({ children }) => (
  <p className={elementStyles.formLabel}>{children}</p>
)

FormTitle.propTypes = {
  children: PropTypes.node,
}

export default FormTitle
