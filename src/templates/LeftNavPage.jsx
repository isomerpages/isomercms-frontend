import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './pageComponents/Breadcrumb';
import LeftNav from './pageComponents/LeftNav';

const LeftNavPage = ({ chunk, pages, fileName }) => (
  <div>
    <Breadcrumb />
    <section className="bp-section">
      <div className="bp-container padding--top--lg padding--bottom--xl">
        <div className="row">
          <LeftNav pages={pages} fileName={fileName} />
          <div className="col is-8 is-offset-1-desktop is-12-touch print-content">
            <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
          </div>
        </div>
      </div>
    </section>
  </div>
);

LeftNavPage.propTypes = {
  chunk: PropTypes.string.isRequired,
  pages: PropTypes.shape({
    path: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  fileName: PropTypes.string.isRequired,
};

export default LeftNavPage;
