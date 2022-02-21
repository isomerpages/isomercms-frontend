import FormContext from "components/Form/FormContext"
import FormTitle from "components/Form/FormTitle"
import FormFieldColor from "components/settings/FormFieldColor"
import _ from "lodash"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const ColorPickerSection = ({ colors, saveChanges }) => {
  return (
    <div id="color-fields">
      <p className={elementStyles.formSectionHeader}>Colors</p>
      <FormContext isRequired>
        <div className={elementStyles.formColor}>
          <FormTitle className={elementStyles.formColorLabel}>
            Primary
          </FormTitle>
          <FormFieldColor
            id="primary-color"
            value={colors["primary-color"]}
            saveChanges={(selectedColor) => {
              saveChanges({
                ...colors,
                "primary-color": selectedColor,
              })
            }}
          />
        </div>
        <div className={elementStyles.formColor}>
          <FormTitle className={elementStyles.formColorLabel}>
            Secondary
          </FormTitle>
          <FormFieldColor
            id="secondary-color"
            value={colors["secondary-color"]}
            saveChanges={(selectedColor) => {
              saveChanges({
                ...colors,
                "secondary-color": selectedColor,
              })
            }}
          />
        </div>
        <div id="media-color-fields">
          {colors["media-colors"].map((category, index) => {
            const { title: mediaColorName, color } = category
            return (
              <div className={elementStyles.formColor}>
                <FormTitle className={elementStyles.formColorLabel}>
                  {`Resource ${index + 1}`}
                </FormTitle>
                <FormFieldColor
                  id={`media-color@${index}`}
                  value={color}
                  key={mediaColorName}
                  saveChanges={(selectedColor) => {
                    const newMediaColors = _.cloneDeep(colors["media-colors"])
                    newMediaColors[index].color = selectedColor
                    saveChanges({
                      ...colors,
                      "media-colors": newMediaColors,
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      </FormContext>
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
