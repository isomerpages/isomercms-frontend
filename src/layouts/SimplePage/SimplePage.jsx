import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SimplePage extends Component {
  componentDidMount() {
  }

  // This following template was taken from the 'Simple Page'
  nestWithinLayout = (chunk) => {
    return `<section class="bp-section"><div class="bp-container content padding--top--lg padding--bottom--xl"><div class="row"><div class="col is-8 is-offset-2 print-content"> ${chunk} </div></div></div></section>`;
  }

  render() {
    const { chunk } = this.props;
    return (
      <div dangerouslySetInnerHTML={{__html: this.nestWithinLayout(chunk)}} />
    );
  }
}

SimplePage.propTypes = {
  chunk: PropTypes.string.isRequired,
};