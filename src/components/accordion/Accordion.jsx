/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import update from 'immutability-helper';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import cleanedData from './utils';
import AccordionTitle from './AccordionTitle';
import './Accordion.css';

const data = cleanedData;

// accordion takes in directory structure data as a prop
export default class DragAndDropAccordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: {}, // manages which collections in the accordion are open
      collectionOrder: [], // order of collections in the accordion

      // create an object to maintain second-level collections and
      // second-level activeIndex
    };
    this.onCollectionClick = this.onCollectionClick.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    // const { data } = this.props;
    const { collectionOrder } = data;

    // sets all collections to be closed in the accordion at first
    const activeIndex = {};
    collectionOrder.forEach((collection) => {
      Object.assign(activeIndex, {
        [collection]: false,
      });
    });

    // also set the original collection order - for Drag and Drop purposes
    await this.setState({
      activeIndex,
      collectionOrder,
    });
  }

  // a function to toggle the accordion
  async onCollectionClick(event) {
    const { id } = event.target; // button id of the collection being clicked

    // get the collection name
    const collectionName = id.split('-').slice(0, -1).join('-');

    // update whether a collection is expanded or not
    await this.setState((currState) => ({
      ...currState,
      activeIndex: update(currState.activeIndex, {
        [collectionName]: {
          $set: !currState.activeIndex[collectionName],
        },
      }),
    }));
  }

  async onDragEnd(result) {
    const {
      destination,
      source,
      draggableId,
      type,
    } = result;
    const { collectionOrder } = this.state;

    // if no destination, don't do anything
    if (!destination) {
      return;
    }

    // if destination = source, don't do anything
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    if (type === 'collection') {
      // reorder the collection after drag
      const newCollectionOrder = Array.from(collectionOrder);
      newCollectionOrder.splice(source.index, 1);
      newCollectionOrder.splice(destination.index, 0, draggableId);
      await this.setState({
        collectionOrder: newCollectionOrder,
      });
    }
  }

  render() {
    const { activeIndex, collectionOrder } = this.state;
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="all-collections" type="collection">
          {(provided) => (
            <div
              className="accordion__section"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {collectionOrder.map((collection, index) => (
                <AccordionTitle
                // these are props for the accordion
                  collection={collection}
                  onCollectionClick={this.onCollectionClick}
                  pages={data.collections[collection].pages}
                  isActive={activeIndex[collection]}
                // these are props for drag and drop
                  index={index}
                  key={collection}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
