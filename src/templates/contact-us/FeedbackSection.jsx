import React from 'react';
import PropTypes from 'prop-types';

const FeedbackSection = ({ feedback }) => (
  <>
  { feedback &&
    <div className="row is-multiline margin--bottom--lg">
      <div className="col is-12 padding--bottom--none">
        <h5 className="has-text-secondary has-text-weight-semibold">Send us your feedback</h5>
      </div>
      <div className="col is-8">
        {/* fixing target='_blank' warning: https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/ */}
        <p>
          If you have a query, feedback or wish to report a problem related to this website,
          please fill in the <a href={feedback} rel="noopener noreferrer" target="_blank"><u>online form</u></a>.
        </p>
      </div>
    </div>  
  }
  </>
);

FeedbackSection.propTypes = {
  feedback: PropTypes.string,
};

export default FeedbackSection;



