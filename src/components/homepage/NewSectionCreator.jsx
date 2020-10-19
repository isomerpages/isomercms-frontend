import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';

const NewSectionCreator = ({ createHandler, hasResources }) => (
  <div className={`${elementStyles.card} ${elementStyles.addNewHomepageSection}`}>
    <h2>
      Add a new section
      <i className="bx bx-plus" />
    </h2>
    <select name="newSection" id="section-new" onChange={createHandler}>
      <option value="">--Please choose a new section--</option>
      <option value="infobar">Infobar</option>
      <option value="infopic">Infopic</option>
      {/* If homepage already has a Resources section,
        don't display the option to create one */}
      {hasResources
        ? null
        : <option value="resources">Resources</option>}
    </select>
  </div>
);

export default NewSectionCreator;

NewSectionCreator.propTypes = {
  createHandler: PropTypes.func.isRequired,
  hasResources: PropTypes.bool.isRequired,
};
