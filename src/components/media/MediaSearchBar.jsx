import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"

export const MediaSearchBar = ({ value, onSearchChange }) => {
  return (
    <div className={elementStyles.mediaSearchBarContainer}>
      <input
        type="text"
        placeholder="Search by file name"
        value={value}
        autoComplete="off"
        onChange={onSearchChange}
      />
    </div>
  )
}

MediaSearchBar.propTypes = {
  value: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
}
