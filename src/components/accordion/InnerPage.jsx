/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import AccordionSection from './AccordionSection';

export default class InnerPage extends Component {
  render() {
    const { pages, isActive } = this.props;
    return pages.map((page, index) => (
      // then add relevant bits to onDragEnd
      <AccordionSection
      // props for the accordion
        pageName={page}
        isActive={isActive}
      // props for drag and drop
        key={page}
        index={index}
      />
    ));
  }
}
