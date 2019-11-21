import React from 'react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ title, collection }) => (
  <section className="bp-section is-small bp-section-pagetitle" style={{ width: `${100 / 0.65}%` }}>
    <div className="bp-container" style={{ right: '50px' }}>
      <div className="row">
        <div className="col">
          <nav className="bp-breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/"><small>HOME</small></a></li>
              { collection ? (
                <li><a href="/"><small>{ collection.toUpperCase() }</small></a></li>
              ) : null}
              <li><a href="/"><small>{ title.toUpperCase() }</small></a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div className="bp-container" style={{ right: '50px' }}>
      <div className="row">
        <div className="col">
          <h1 className="has-text-white"><b>{ title }</b></h1>
        </div>
      </div>
    </div>
  </section>
);

Breadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
};

export default Breadcrumb;
