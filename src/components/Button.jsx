import PropTypes from "prop-types"

export default function Button(props) {
  // extract props
  const {
    label,
    disabled,
    disabledStyle,
    className,
    callback,
    isLoading,
    ...remainingProps
  } = props
  return (
    <button
      type="button"
      className={isLoading ? `${className} ${disabledStyle}` : className}
      disabled={isLoading ? true : disabled}
      onClick={() => callback()}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
    >
      {isLoading ? (
        <div className="spinner-border text-primary" role="status" />
      ) : (
        label
      )}
    </button>
  )
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

Button.defaultProps = {
  disabled: false,
}
