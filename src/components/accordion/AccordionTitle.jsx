/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import InnerPage from './InnerPage';
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
        {(draggableProvided) => (
          <div
            className="accordion__section"
            {...draggableProvided.draggableProps}
            ref={draggableProvided.innerRef}
            {...draggableProvided.dragHandleProps}
          >
            <Droppable droppableId={collection} type="page">
              {(droppableProvided) => (
                <div className="accordion__section">
                  <button
                    className="accordion"
                    type="button"
                  // these are props for the accordion
                    id={`${collection}-button`}
                    onClick={onCollectionClick}
                  // these are props for the drag and drop
                    key={`${collection}-button`}
                  >
                    {collection}
                    <Plus className="accordion__icon" width={10} fill="#777" />
                  </button>
                  <div
                    // props for the drag and drop
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    <InnerPage pages={pages} isActive={isActive} />
                    {droppableProvided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}
