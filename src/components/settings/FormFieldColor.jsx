import ColorPickerModal from "components/settings/ColorPickerModal"
import PropTypes from "prop-types"
import React, { useCallback, useEffect, useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormFieldColor = ({
  title,
  defaultValue,
  value,
  id,
  isRequired,
  style,
  saveChanges,
}) => {
  const [originalColor, setOriginalColor] = useState()
  const [colorPickerToggle, setColorPickerToggle] = useState(false)

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
        previousSibling: { value },
      },
    } = event
    setOriginalColor(value)
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

  const setRealTimeColor = (color) => {
    const hex = color.hex ? color.hex : `#${color}`
    saveChanges(hex)
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
      <div className={elementStyles.formColor}>
        <p className={elementStyles.formColorLabel}>{title}</p>
        <input
          type="text"
          placeholder={title}
          value={value}
          defaultValue={defaultValue}
          id={id}
          autoComplete="off"
          required={isRequired}
          className={elementStyles.formColorInput}
          style={style}
          disabled
        />
        <div
          className={elementStyles.formColorBox}
          id={`${id}-box`}
          style={{ background: value }}
          onClick={activateColorPicker}
        />
      </div>
    </>
  )
}

export default FormFieldColor

FormFieldColor.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
  saveChanges: PropTypes.func.isRequired,
}

FormFieldColor.defaultProps = {
  defaultValue: undefined,
  style: undefined,
}
