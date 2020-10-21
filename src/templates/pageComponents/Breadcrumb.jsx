import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ title, date, collection }) => (
  <section className="bp-section is-small bp-section-pagetitle">
    <div className="bp-container breadcrumb-container">
      <div className="row">
        <div className="col">
          <nav className="bp-breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><small>HOME</small></li>
              { collection ? (
                <li><small>{ collection.toUpperCase() }</small></li>
              ) : null}
              <li><small>{ title.toUpperCase() }</small></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div className="bp-container breadcrumb-container">
      <div className="row">
        <div className="col">
          <h1 className="has-text-white"><b>{ title.split(' ').map((string) => string.charAt(0).toUpperCase() + string.slice(1)).join(' ') }</b></h1>
        </div>
      </div>
    </div>
    {date &&
      <div className="bp-container breadcrumb-container">
        <div className="row">
          <div className="col">
            <p className="has-text-white">{ date }</p>
          </div>
        </div>
      </div>
    }
  </section>
);

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
};

export default Breadcrumb;
