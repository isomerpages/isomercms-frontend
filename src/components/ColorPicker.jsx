import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const ColorPicker = ({
  value,
  onColorClick,
}) => (
  <>
    <div
      className={elementStyles.formColorBox}
      style={{ background: value }}
      onClick={onColorClick}
    />
  </>
);

export default ColorPicker;

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onColorClick: PropTypes.func.isRequired,
};
