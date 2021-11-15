import PropTypes from "prop-types"
import React, { useEffect } from "react"

export default function LoadingButton(props) {
  // extract props
  const {
    label,
    disabled,
    disabledStyle,
    className,
    callback,
    showLoading,
    ...remainingProps
  } = props

  // track whether button is loading or not
  const [isLoading, setButtonLoading] = React.useState(false)

  useEffect(() => {
    let _isMounted = true

    const runCallback = async () => {
      try {
        await callback()
      } catch (err) {
        if (_isMounted) setButtonLoading(false)
        throw err
      }
      if (_isMounted) setButtonLoading(false)
    }

    if (isLoading) {
      runCallback()
    }

    return () => {
      _isMounted = false
    }
  }, [isLoading])

  return (
    <button
      type="button"
      className={isLoading ? `${className} ${disabledStyle}` : className}
      disabled={isLoading ? true : disabled}
      onClick={() => setButtonLoading(true)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
    >
      {isLoading || showLoading ? (
        <div className="spinner-border text-primary" role="status" />
      ) : (
        label
      )}
    </button>
  )
}

LoadingButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.string,
  className: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  showLoading: PropTypes.bool,
}

LoadingButton.defaultProps = {
  disabled: false,
}
