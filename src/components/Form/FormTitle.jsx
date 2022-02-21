import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormTitle = ({ className = elementStyles.formLabel, children }) => (
  <p className={className}>{children}</p>
)

FormTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export default FormTitle
