/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import AccordionSection from './AccordionSection';
import Plus from './Plus';

export default class AccordionTitle extends Component {
  render() {
    const {
      collection,
      onCollectionClick,
      index,
      pages,
      isActive,
    } = this.props;
    return (
      // we need to disable interactive element blocking to drag our buttons
      // this is okay - we are only using the onClick prop for buttons, and not other interactions
      <Draggable draggableId={collection} index={index} disableInteractiveElementBlocking="true">
        {(provided) => ([
          <button
            type="button"
          // these are props for the accordion
            className="accordion"
            id={`${collection}-button`}
            onClick={onCollectionClick}
          // these are props for the drag and drop
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            key={`${collection}-button`}
          >
            {collection}
            <Plus className="accordion__icon" width={10} fill="#777" />
          </button>,
          pages.map((page) => (
            <AccordionSection pageName={page} isActive={isActive} key={page} />
          )),
        ])}
      </Draggable>
    );
  }
}
