import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

export default function LoadingButton(props) {
  // extract props
  const {
    label,
    disabled,
    className,
    callback,
  } = props;

  // track whether button is loading or not
  const [isLoading, setButtonLoading] = React.useState(false);
  return (
    <button
      type="button"
      className={isLoading ? elementStyles.disabled : className}
      disabled={isLoading ? true : disabled}
      onClick={() => {
        setButtonLoading(true);
        callback().then(() => setButtonLoading(false));
      }}
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
  className: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

LoadingButton.defaultProps = {
  disabled: false,
};
