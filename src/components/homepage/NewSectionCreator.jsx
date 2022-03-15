import Dropdown from "components/Dropdown"
import PropTypes from "prop-types"
import React, { useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

// Section constructors
const defaultResourcesSection = () => ({
  resources: {
    title: "Resources Section Title",
    subtitle: "Resources Section Subtitle",
    button: "Resources Button Name",
  },
})

const defaultInfobarSection = () => ({
  infobar: {
    title: "Infobar Title",
    subtitle: "Infobar Subtitle",
    description: "Infobar description",
    button: "Button Text",
    url: "", // No default value so that no broken link is created
  },
})

const defaultInfopicSection = () => ({
  infopic: {
    title: "Infopic Title",
    subtitle: "Infopic Subtitle",
    description: "Infopic description",
    button: "Button Text",
    url: "", // No default value so that no broken link is created
    image: "", // Always blank since the image modal handles this
    alt: "Image alt text",
  },
})

const enumSection = (type) => {
  switch (type) {
    case "resources":
      return defaultResourcesSection()
    case "infobar":
      return defaultInfobarSection()
    case "infopic":
      return defaultInfopicSection()
  }
}

export const NewSectionCreator = ({ createHandler, hasResources }) => {
  const [newSectionType, setNewSectionType] = useState()
  const onFormSubmit = () => {
    const event = {
      target: {
        id: newSectionType,
        value: enumSection(newSectionType),
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

NewSectionCreator.propTypes = {
  createHandler: PropTypes.func.isRequired,
  hasResources: PropTypes.bool.isRequired,
}
