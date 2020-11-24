import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function LoadingButton(props) {
  // extract props
  const {
    label,
    disabled,
    disabledStyle,
    className,
    callback,
    ...remainingProps
  } = props;

  // track whether button is loading or not
  const [isLoading, setButtonLoading] = React.useState(false);

  useEffect(() => {
    let _isMounted = true

    const runCallback = async () => {
      await callback();
      if (_isMounted) setButtonLoading(false);
    }

    if (isLoading) {
      runCallback()
    }

    return () => { _isMounted = false }
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
      {isLoading
        ? (
          <div className="spinner-border text-primary" role="status" />
        ) : label}
    </button>
  );
}

LoadingButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

LoadingButton.defaultProps = {
  disabled: false,
};
