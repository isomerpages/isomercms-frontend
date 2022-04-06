import PropTypes from "prop-types"
import InputMask from "react-input-mask"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const InputMaskFormField = ({
  title,
  value,
  mask,
  maskChar,
  alwaysShowMask,
  id,
  hasError,
  errorMessage,
  onFieldChange,
  style,
  disabled,
  maxWidth,
}) => (
  <>
    {/* NOTE: This is silenced as it will be removed in #774 */}
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    {title && <label className={elementStyles.formLabel}>{title}</label>}
    <div className={`d-flex text-nowrap ${maxWidth ? "w-100" : ""}`}>
      <InputMask
        mask={mask}
        maskChar={maskChar}
        alwaysShowMask={alwaysShowMask}
        id={id}
        value={value}
        style={style}
        onChange={onFieldChange}
        className={hasError || errorMessage ? `${elementStyles.error}` : null}
        disabled={disabled}
      />
    </div>
    {errorMessage && (
      <span className={elementStyles.error}>{errorMessage}</span>
    )}
  </>
)

export default InputMaskFormField

InputMaskFormField.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  maskChar: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  id: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  style: PropTypes.string,
  maxWidth: PropTypes.bool,
}

InputMaskFormField.defaultProps = {
  style: undefined,
  errorMessage: null,
}
