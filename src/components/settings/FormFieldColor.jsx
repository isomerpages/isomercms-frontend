import { Input, Button } from "@opengovsg/design-system-react"
import ColorPickerModal from "components/settings/ColorPickerModal"
import PropTypes from "prop-types"
import { useCallback, useEffect, useState } from "react"

import { varyHexColor } from "utils/colours"

const FormFieldColor = ({ value, id, saveChanges }) => {
  const [originalColor, setOriginalColor] = useState()
  const [colorPickerToggle, setColorPickerToggle] = useState(false)

  const setRealTimeColor = (color) => {
    const hex = color.hex ? color.hex : `#${color}`
    saveChanges(hex)
  }

  // event listener callback function that resets ColorPicker modal
  // when escape key is pressed while modal is active
  const escFunction = useCallback(
    (event) => {
      if (event.key === "Escape") {
        setColorPickerToggle(false)
      }
    },
    [setColorPickerToggle]
  )

  // event listener callback function that resets ColorPicker modal
  // when mouse clicks on area outside of modal while modal is active
  const clickFunction = useCallback(
    (event) => {
      let { target } = event
      let { tagName } = target
      // keep checking parent element until you hit a tagName of FORM
      while (tagName !== "FORM") {
        target = target.parentElement
        tagName = target.tagName
      }
      // toggle only if descendant of colorModal
      if (target.id !== "colorModal") {
        setColorPickerToggle(false)
      }
    },
    [setColorPickerToggle]
  )

  useEffect(() => {
    if (colorPickerToggle) {
      // setup escape key event listener to exit from ColorPicker modal
      document.addEventListener("keydown", escFunction)
      document.addEventListener("click", clickFunction)
    } else {
      // remove event listeners
      document.removeEventListener("keydown", escFunction)
      document.removeEventListener("click", clickFunction)
      if (originalColor) {
        saveChanges(originalColor)
      }
    }
    return () => {
      document.removeEventListener("keydown", escFunction)
      document.removeEventListener("click", clickFunction)
    }
  }, [colorPickerToggle, escFunction, clickFunction])

  // toggles color picker modal
  const activateColorPicker = (event) => {
    const {
      target: {
        previousSibling: { value: colourValue },
      },
    } = event
    setOriginalColor(colourValue)
    setColorPickerToggle(true)
  }

  // onColorSelect sets value of appropriate color field
  const onColorSelect = (event, color) => {
    // prevent event from reloading
    // prevent parent form from being submitted
    event.preventDefault()
    event.stopPropagation()

    // reflect color changes
    setRealTimeColor(color)
    setOriginalColor(null)
    setColorPickerToggle(false)
  }

  return (
    <>
      {/* Color picker modal */}
      {colorPickerToggle && (
        <ColorPickerModal
          value={value}
          onColorSelect={onColorSelect}
          setRealTimeColor={setRealTimeColor}
          elementId={id}
        />
      )}
      <Input
        value={value}
        id={id}
        // This component is purely presentational.
        // It is used to display the hex code and hence, is alwaysDisabled.
        isDisabled
        w="40%"
      />
      <Button
        _hover={{
          backgroundColor: varyHexColor(value, 10),
        }}
        _active={{
          backgroundColor: varyHexColor(value, 20),
        }}
        aria-label="Select colour"
        bgColor={value}
        id={`${id}-box`}
        onClick={activateColorPicker}
      />
    </>
  )
}

export default FormFieldColor

FormFieldColor.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  saveChanges: PropTypes.func.isRequired,
}
