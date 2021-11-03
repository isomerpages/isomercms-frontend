import PropTypes from "prop-types"
import React, { useState } from "react"

import Dropdown from "components/Dropdown"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const NewSectionCreator = ({ createHandler, hasResources }) => {
  const [newSectionType, setNewSectionType] = useState()
  const onFormSubmit = () => {
    const event = {
      target: {
        id: "section-new",
        value: newSectionType,
      },
    }
    createHandler(event)
  }
  const options = hasResources
    ? ["Infobar", "Infopic"]
    : ["Infobar", "Infopic", "Resources"]
  const defaultText = "--Choose a new section--"
  return (
    <div
      className={`d-flex flex-column ${elementStyles.card} ${elementStyles.addNewHomepageSection}`}
    >
      <h2>Add a new section</h2>
      <div className="d-flex justify-content-between">
        <Dropdown
          options={options}
          defaultOption={defaultText}
          emptyDefault
          name="newSection"
          id="section-new"
          onFieldChange={(e) => setNewSectionType(e.target.value)}
        />
        <div>
          <button
            type="button"
            className={
              newSectionType ? elementStyles.blue : elementStyles.disabled
            }
            onClick={onFormSubmit}
            disabled={!newSectionType}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewSectionCreator

NewSectionCreator.propTypes = {
  createHandler: PropTypes.func.isRequired,
  hasResources: PropTypes.bool.isRequired,
}
