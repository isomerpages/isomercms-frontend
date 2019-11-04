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
      pageOrder: {}, // order of pages within each collection

      // create an object to maintain second-level collections and
      // second-level activeIndex
    };
    this.onCollectionClick = this.onCollectionClick.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  async componentDidMount() {
    // const { data } = this.props;
    const { collections, collectionOrder } = data;

    // sets all collections to be closed in the accordion at first
    const activeIndex = {};
    collectionOrder.forEach((collection) => {
      Object.assign(activeIndex, {
        [collection]: false,
      });
    });

    // collectionOrder already tracks the order of the columns
    // we need a page order to track the order of the pages within the columns
    const pageOrder = {};
    Object.keys(collections).forEach((key) => {
      Object.assign(pageOrder, {
        [key]: collections[key].pages,
      });
    });


    // also set the original collection order - for Drag and Drop purposes
    await this.setState({
      activeIndex,
      collectionOrder,
      pageOrder,
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
    const { collectionOrder, pageOrder } = this.state;

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

    if (type === 'page') {
      const startCollection = source.droppableId;
      const endCollection = destination.droppableId;

      // reordering within the same collection
      if (startCollection === endCollection) {
        // make a copy of the existing order of pages in the collection
        const newPageOrder = Array.from(pageOrder[startCollection]);

        // insert the new page and remove it from the old one
        newPageOrder.splice(source.index, 1);
        newPageOrder.splice(destination.index, 0, draggableId);

        // update state for pageOrder
        this.setState((currState) => ({
          ...currState,
          pageOrder: update(currState.pageOrder, {
            [startCollection]: {
              $set: newPageOrder,
            },
          }),
        }));
      // reordering between different collections
      } else if (startCollection !== endCollection) {
        // make copies of existing source and destination collections' page orders
        const newSourceOrder = Array.from(pageOrder[startCollection]);
        const newDestOrder = Array.from(pageOrder[endCollection]);

        // remove from source and insert into destination
        newSourceOrder.splice(source.index, 1);
        newDestOrder.splice(destination.index, 0, draggableId);

        // update state for pageOrder
        this.setState((currState) => ({
          ...currState,
          pageOrder: update(currState.pageOrder, {
            [startCollection]: {
              $set: newSourceOrder,
            },
            [endCollection]: {
              $set: newDestOrder,
            },
          }),
        }));
      }
    }
  }

  render() {
    const { activeIndex, collectionOrder, pageOrder } = this.state;
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
                  pages={pageOrder[collection]}
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
