import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './pageComponents/Breadcrumb';

// This following template was taken from the 'Simple Page'
const SimplePage = ({ chunk, title }) => (
  <div>
    <Breadcrumb title={title} />
    <section className="bp-section">
      <div className="bp-container content padding--top--lg padding--bottom--xl">
        <div className="row">
          <div className="col is-8 is-offset-1-desktop is-12-touch print-content" style={{ left: '80px' }}>
            <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
          </div>
        </div>
      </div>
    </section>
  </div>
);

SimplePage.propTypes = {
  chunk: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SimplePage;
