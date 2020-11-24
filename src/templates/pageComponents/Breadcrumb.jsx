import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ title, collection }) => (
  <nav className="bp-breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li><small><a>HOME</a></small></li>
      { collection ? (
        <li><small><a>{ collection.toUpperCase() }</a></small></li>
      ) : null}
      <li><small><a>{ title.toUpperCase() }</a></small></li>
    </ul>
  </nav>
);

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string,
};

export default Breadcrumb;
