import FormFieldColor from "components/settings/FormFieldColor"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const ColorPickerSection = ({ colors, saveChanges }) => {
  return (
    <div id="color-fields">
      <p className={elementStyles.formSectionHeader}>Colors</p>
      <FormFieldColor
        title="Primary"
        id="primary-color"
        value={colors["primary-color"]}
        isRequired
        saveChanges={(selectedColor) => {
          saveChanges({
            ...colors,
            "primary-color": selectedColor,
          })
        }}
      />
      <FormFieldColor
        title="Secondary"
        id="secondary-color"
        value={colors["secondary-color"]}
        isRequired
        saveChanges={(selectedColor) => {
          saveChanges({
            ...colors,
            "secondary-color": selectedColor,
          })
        }}
      />
      <div id="media-color-fields">
        {colors["media-colors"].map((category, index) => {
          const { title: mediaColorName, color } = category
          return (
            <FormFieldColor
              title={`Resource ${index + 1}`}
              id={`media-color@${index}`}
              value={color}
              key={mediaColorName}
              isRequired
              saveChanges={(selectedColor) => {
                const newMediaColors = _.cloneDeep(colors["media-colors"])
                newMediaColors[index].color = selectedColor
                saveChanges({
                  ...colors,
                  "media-colors": newMediaColors,
                })
              }}
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
