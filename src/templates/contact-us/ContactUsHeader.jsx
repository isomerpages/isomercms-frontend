import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from '../pageComponents/Breadcrumb';


const ContactUsHeader = ({ 
  agencyName, 
}) => (
  <section className="bp-section">
    <div className="bp-container">
      <div className="row is-inverted">
        <div className="col is-8 is-offset-2">
          <Breadcrumb title={'Contact Us'}/>
        </div>
      </div>
      <div className="row">
        <div className="col is-8 is-offset-2">
          <h1 className="display has-text-weight-semibold">Get in touch with <br/>{agencyName}</h1>
        </div>
      </div>
    </div>
  </section>
);


ContactUsHeader.propTypes = {
  agencyName: PropTypes.string,
};

export default ContactUsHeader;
