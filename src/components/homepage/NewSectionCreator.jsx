import React, { useState } from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import Dropdown from '../Dropdown';

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
  const options = ['Infobar', 'Infopic']
  if (!hasResources) { options.push('Resources') }
  const defaultText = '--Choose a new section--'

  return (
  <div className={`d-flex flex-column ${elementStyles.card} ${elementStyles.addNewHomepageSection}`}>
    <h2>
      Add a new section
    </h2>
    <div className='d-flex justify-content-between'>
      <Dropdown 
        options={options}
        defaultOption={defaultText}
        emptyDefault={true}
        id='section-new'
        onFieldChange={setNewSectionType}
      />
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
