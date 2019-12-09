import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const ColorPicker = ({
  value,
  onColorSelect,
}) => {
  // initiate selectedColor as color passed in as props
  const [selectedColor, setSelectedColor] = useState(value);
  const handleColorSelect = (color, event) => (setSelectedColor(color));

  return (
    <>
      <form
        className={elementStyles.colorModal}
        id="colorModal"
        onSubmit={(event) => (onColorSelect(event, selectedColor))}
      >
        <SketchPicker width={250} color={selectedColor} onChangeComplete={handleColorSelect} />
        {/* Select color */}
        <div className={elementStyles.modalButtons}>
          <button type="submit">Select</button>
        </div>
      </form>
    </>
  );
};

export default ColorPicker;

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
};
