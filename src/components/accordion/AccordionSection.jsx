/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

export default class AccordionSection extends Component {
  render() {
    const { pageName, isActive } = this.props;
    return (
      isActive ? (
        <div className="accordion__content">
          <div className="accordion__text">
            {pageName}
          </div>
        </div>
      ) : (
        null
      )
    );
  }
}
