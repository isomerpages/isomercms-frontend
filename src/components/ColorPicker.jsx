import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const ColorPicker = ({
  value,
  onColorSelect,
  realTimeColor,
}) => {
  // initiate selectedColor as color passed in as props
  const [selectedColor, setSelectedColor] = useState(value);
  const handleColorSelect = (color, event) => {
    setSelectedColor(color);
    realTimeColor(color);
  };

  return (
    <>
      <form
        className={elementStyles.colorModal}
        id="colorModal"
        onSubmit={(event) => (onColorSelect(event, selectedColor))}
      >
        <SketchPicker
          width={250}
          color={selectedColor}
          disableAlpha="true"
          onChange={handleColorSelect}
        />
        {/* Confirm color selection with button */}
        <button className={elementStyles.modalButtons} type="submit">Select</button>
      </form>
    </>
  );
};

export default ColorPicker;

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  realTimeColor: PropTypes.func.isRequired,
};
