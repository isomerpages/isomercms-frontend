import * as _ from "lodash"
import PropTypes from "prop-types"
import React, { useCallback, useEffect, useState } from "react"

import ColorPicker from "components/settings/ColorPicker"
import FormFieldColor from "components/settings/FormFieldColor"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const ColorPickerSection = ({ colors, saveChanges }) => {
  const [currColors, setCurrColors] = useState(colors)
  const [colorPicker, setColorPicker] = useState({
    currentColor: "",
    elementId: "",
    oldColors: {},
  })
  const [colorPickerToggle, setColorPickerToggle] = useState(false)

  useEffect(() => {
    setCurrColors(colors)
  }, [colors])
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
      if (!_.isEmpty(colorPicker.oldColors)) {
        setCurrColors(colorPicker.oldColors)
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
        previousSibling: { id, value },
      },
    } = event
    const currentColor = value.slice(1)
    setColorPicker({
      currentColor,
      elementId: id,
      oldColors: { ...currColors },
    })
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

    // reset color picker
    setColorPicker({
      currentColor: "",
      elementId: "",
      oldColors: {},
    })
    setColorPickerToggle(false)
  }

  const setRealTimeColor = (color) => {
    const { elementId } = colorPicker
    // there is no hex property if the color submitted is the
    // same as the original color
    const hex = color.hex ? color.hex : `#${color}`

    // set state of color fields
    if (elementId === "primary-color" || elementId === "secondary-color") {
      // setCurrColors()
      saveChanges({
        ...currColors,
        [elementId]: hex,
      })
    } else {
      // set state of resource colors
      const index = elementId.split("@")[elementId.split("@").length - 1]
      const newMediaColors = _.cloneDeep(currColors["media-colors"])
      newMediaColors[index].color = hex
      // setCurrColors()
      saveChanges({
        ...currColors,
        "media-colors": newMediaColors,
      })
    }
  }

  const changeHandler = (event) => {
    const { id, value, parentElement } = event.target
    const grandparentElementId = parentElement?.parentElement?.id
    // const errorMessage = validateSettings(id, value);

    if (grandparentElementId === "color-fields") {
      setCurrColors({
        ...currColors,
        [id]: value,
      })
    } else if (grandparentElementId === "media-color-fields") {
      const index = id.split("@")[id.split("@").length - 1]

      // set value to be used to set state for media colors
      const newMediaColors = [...currColors["media-colors"]]
      newMediaColors[index].color = value

      setCurrColors({
        ...currColors,
        "media-colors": newMediaColors,
      })
    }
  }

  return (
    <div id="color-fields">
      {/* Color picker modal */}
      {colorPickerToggle && (
        <ColorPicker
          value={colorPicker.currentColor}
          onColorSelect={onColorSelect}
          setRealTimeColor={setRealTimeColor}
          elementId={colorPicker.elementId}
        />
      )}
      <p className={elementStyles.formSectionHeader}>Colors</p>
      <FormFieldColor
        title="Primary"
        id="primary-color"
        value={currColors["primary-color"]}
        isRequired
        onFieldChange={changeHandler}
        onColorClick={activateColorPicker}
      />
      <FormFieldColor
        title="Secondary"
        id="secondary-color"
        value={currColors["secondary-color"]}
        isRequired
        onFieldChange={changeHandler}
        onColorClick={activateColorPicker}
      />
      <div id="media-color-fields">
        {currColors["media-colors"].map((category, index) => {
          const { title: mediaColorName, color } = category
          return (
            <FormFieldColor
              title={`Resource ${index + 1}`}
              id={`media-color@${index}`}
              value={color}
              key={mediaColorName}
              isRequired
              onFieldChange={changeHandler}
              onColorClick={activateColorPicker}
            />
          )
        })}
      </div>
    </div>
  )
}

ColorPickerSection.propTypes = {
  colors: PropTypes.shape({
    "primary-color": PropTypes.string,
    "secondary-color": PropTypes.string,
    "media-colors": PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        color: PropTypes.string,
      })
    ),
  }),
  saveChanges: PropTypes.func.isRequired,
}

export default ColorPickerSection
