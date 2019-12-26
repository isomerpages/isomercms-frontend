import React from 'react';
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
  return (
    <button
      type="button"
      className={isLoading ? disabledStyle : className}
      disabled={isLoading ? true : disabled}
      onClick={async () => {
        setButtonLoading(true);
        await callback();
        setButtonLoading(false);
      }}
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
