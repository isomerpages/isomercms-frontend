import React from "react"
import { slugifyLower } from "../utils"
import PropTypes from "prop-types"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

const Dropdown = ({
  options,
  defaultOption,
  emptyDefault,
  name,
  id,
  onFieldChange,
}) => (
  <>
    <select
      className={`${elementStyles.form} ${elementStyles.formHorizontal} ${elementStyles.formHorizontalInput}`}
      name={name}
      id={id}
      onChange={onFieldChange}
    >
      {defaultOption && (
        <option
          value={emptyDefault ? "" : slugifyLower(defaultOption)}
          key={slugifyLower(defaultOption)}
        >
          {defaultOption}
        </option>
      )}
      {options
        .filter((option) => option !== defaultOption)
        .map((option) => (
          <option value={slugifyLower(option)} key={slugifyLower(option)}>
            {option}
          </option>
        ))}
    </select>
  </>
)

export default Dropdown

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultOption: PropTypes.string,
  emptyDefault: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
}
