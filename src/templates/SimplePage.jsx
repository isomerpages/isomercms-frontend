import React from 'react';
import PropTypes from 'prop-types';

// This following template was taken from the 'Simple Page'
const nestWithinLayout = (chunk) => `<section class="bp-section"><div class="bp-container content padding--top--lg padding--bottom--xl"><div class="row"><div class="col is-8 is-offset-2 print-content"> ${chunk} </div></div></div></section>`;


// eslint-disable-next-line arrow-body-style
const SimplePage = ({ chunk }) => {
  return <div dangerouslySetInnerHTML={{ __html: nestWithinLayout(chunk) }} />;
};

SimplePage.propTypes = {
  chunk: PropTypes.string.isRequired,
};

export default SimplePage;
