/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class AccordionSection extends Component {
  render() {
    const { pageName, isActive, index } = this.props;
    return (
      isActive ? (
        <Draggable
          draggableId={pageName}
          index={index}
        >
          {(provided) => (
            <div
              className="accordion__content"
              // props for the draggable
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className="accordion__text">
                {pageName}
              </div>
            </div>
          )}
        </Draggable>
      ) : (
        null
      )
    );
  }
}
