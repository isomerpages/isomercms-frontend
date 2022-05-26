import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"
import { useState } from "react"
import { SketchPicker } from "react-color"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const ColorPickerModal = ({ value, onColorSelect, setRealTimeColor }) => {
  // initiate selectedColor as color passed in as props
  const [selectedColor, setSelectedColor] = useState(value)
  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setRealTimeColor(color)
  }

  return (
    <>
      <form
        className={elementStyles.colorModal}
        id="colorModal"
        onSubmit={(event) => onColorSelect(event, selectedColor)}
      >
        <SketchPicker
          width={250}
          color={selectedColor}
          disableAlpha="true"
          onChange={handleColorSelect}
        />
        {/* Confirm color selection with button */}
        <Button id="colorModalSubmit" type="submit" mt="10px">
          Select
        </Button>
      </form>
    </>
  )
}

export default ColorPickerModal

ColorPickerModal.propTypes = {
  value: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  setRealTimeColor: PropTypes.func.isRequired,
}
