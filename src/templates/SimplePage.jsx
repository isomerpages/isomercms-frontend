import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './Breadcrumb';

// This following template was taken from the 'Simple Page'
// eslint-disable-next-line arrow-body-style
const SimplePage = ({ chunk }) => {
  return (
    <div>
      <Breadcrumb />
      <section className="bp-section">
        <div className="bp-container content padding--top--lg padding--bottom--xl">
          <div className="row">
            <div className="col is-8 is-offset-2 print-content" dangerouslySetInnerHTML={{ __html: chunk }} />
          </div>
        </div>
      </section>
    </div>
  );
};

SimplePage.propTypes = {
  chunk: PropTypes.string.isRequired,
};

export default SimplePage;
