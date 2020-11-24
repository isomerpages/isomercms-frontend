import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from './pageComponents/PageHeader';
import LeftNav from './pageComponents/LeftNav';
import _ from 'lodash';

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
    .map((string) => _.upperFirst(string)) // capitalize first letter
    .join(' '); // join it back together
  return (
    <div>
      <PageHeader title={title} collection={collection} />
      <section className="bp-section page-content-body">
        <div className="bp-container padding--top--lg padding--bottom--xl">
          <div className="row">
            <LeftNav leftNavPages={leftNavPages} fileName={fileName} />
            <div className="col is-8 is-offset-1-desktop is-12-touch print-content page-content-body">
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
