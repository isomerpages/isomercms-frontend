import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './Breadcrumb';

const PageHeader = ({ title, date, collection }) => (
  <section className="bp-section is-small bp-section-pagetitle">
    <div className="bp-container page-header-container">
    <div className="row">
        <div className="col">
        <Breadcrumb title={ title } collection={ collection } />
        </div>
    </div>
    </div>
    <div className="bp-container page-header-container">
    <div className="row">
        <div className="col">
        <h1 className="has-text-white"><b>{ title.split(' ').map((string) => string.charAt(0).toUpperCase() + string.slice(1)).join(' ') }</b></h1>
        </div>
    </div>
    </div>
    {date &&
    <div className="bp-container page-header-container">
        <div className="row">
        <div className="col">
            <p className="has-text-white">{ date }</p>
        </div>
        </div>
    </div>
    }
  </section>
);

 PageHeader.propTypes = {
   title: PropTypes.string.isRequired,
   collection: PropTypes.string,
 };

 export default PageHeader;