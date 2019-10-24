import React from 'react';

// eslint-disable-next-line arrow-body-style
const Breadcrumb = () => {
  return (
    <section className="bp-section is-small bp-section-pagetitle" style={{ width: `${100 / 0.65}%` }}>
      <div className="bp-container ">
        <div className="row">
          <div className="col">
            <nav className="bp-breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li><a href="/"><small>HOME</small></a></li>
                <li><a href="/"><small>GENERIC BREADCRUMB</small></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="bp-container">
        <div className="row">
          <div className="col">
            <h1 className="has-text-white"><b>Generic Breadcrumb</b></h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
