import React, { useState } from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';

const NewSectionCreator = ({ createHandler, hasResources }) => {
  const [newSectionType, setNewSectionType] = useState()
  const onFormSubmit = () => {
    const event = {
      target: {
        id: "section-new",
        value: newSectionType
      }
    }
    createHandler(event)
  }
  return (
  <div className={`d-flex flex-column ${elementStyles.card} ${elementStyles.addNewHomepageSection}`}>
    <h2>
      Add a new section
    </h2>
    <div className='d-flex justify-content-between'>
      <select className={`${elementStyles.form} ${elementStyles.formHorizontal} ${elementStyles.formHorizontalInput}`} name="newSection" id="section-new" onChange={(e) => setNewSectionType(e.target.value)}>
        <option value="">--Choose a new section--</option>
        <option value="infobar">Infobar</option>
        <option value="infopic">Infopic</option>
        {/* If homepage already has a Resources section,
          don't display the option to create one */}
        {hasResources
          ? null
          : <option value="resources">Resources</option>}
      </select>
      <div>
        <button type="button" className={newSectionType ? elementStyles.blue: elementStyles.disabled} onClick={onFormSubmit} disabled={!newSectionType}>Select</button>
      </div>
    </div>
  </div>
)};

export default NewSectionCreator;

NewSectionCreator.propTypes = {
  createHandler: PropTypes.func.isRequired,
  hasResources: PropTypes.bool.isRequired,
};
