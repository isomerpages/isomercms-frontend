import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ title, collection }) => (
  <nav className="bp-breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li><small>HOME</small></li>
      { collection ? (
        <li><small>{ collection.toUpperCase() }</small></li>
      ) : null}
      <li><small>{ title.toUpperCase() }</small></li>
    </ul>
  </nav> 
);

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string,
};

export default Breadcrumb;
