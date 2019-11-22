import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './pageComponents/Breadcrumb';
import LeftNav from './pageComponents/LeftNav';

const LeftNavPage = ({
  chunk,
  leftNavPages,
  fileName,
  title,
}) => {
  const currentPage = leftNavPages.filter((page) => page.fileName === fileName);
  const collection = currentPage[0]
    .path.split('%2')[0]
    .slice(1) // remove the underscore at the start of the collection folder name
    .split('-')
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1)) // capitalize first letter
    .join(' '); // join it back together
  return (
    <div>
      <Breadcrumb title={title} collection={collection} />
      <section className="bp-section">
        <div className="bp-container padding--top--lg padding--bottom--xl">
          <div className="row">
            <LeftNav leftNavPages={leftNavPages} fileName={fileName} />
            <div className="col is-8 is-offset-1-desktop is-12-touch print-content" style={{ left: '80px' }}>
              <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

LeftNavPage.propTypes = {
  chunk: PropTypes.string.isRequired,
  leftNavPages: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    fileName: PropTypes.string,
  })).isRequired,
  title: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default LeftNavPage;
