import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from './pageComponents/PageHeader';

// This following template was taken from the 'Simple Page'
const SimplePage = ({ chunk, title, date, collection, resourceRoomName }) => (
  <div>
    <PageHeader title={title} date={date} collection={collection} resourceRoomName={resourceRoomName}/>
    <section className="bp-section">
      <div className="bp-container content padding--top--lg padding--bottom--xl">
        <div className="row">
          <div className="col is-8 is-offset-1-desktop is-12-touch print-content page-content-body">
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
