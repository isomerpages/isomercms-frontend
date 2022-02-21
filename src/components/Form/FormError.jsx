import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { useFormContext } from "./FormContext"

const FormError = ({ children }) => {
  const { hasError } = useFormContext()
  return hasError && <span className={elementStyles.error}>{children}</span>
}

FormError.propTypes = {
  children: PropTypes.node,
}

export default FormError
