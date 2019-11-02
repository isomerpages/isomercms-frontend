/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import Plus from './Plus';

export default class AccordionTitle extends Component {
  render() {
    const { collectionName, onCollectionClick } = this.props;
    return (
      <button className="accordion" id={`${collectionName}-button`} type="button" onClick={onCollectionClick}>
        {collectionName}
        <Plus className="accordion__icon" width={10} fill="#777" />
      </button>
    );
  }
}
