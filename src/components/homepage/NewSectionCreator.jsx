import { Button } from "@opengovsg/design-system-react"
import Dropdown from "components/Dropdown"
import PropTypes from "prop-types"
import { useState } from "react"

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
          <Button onClick={onFormSubmit} isDisabled={!newSectionType}>
            Select
          </Button>
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
