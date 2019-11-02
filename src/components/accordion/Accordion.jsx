/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import update from 'immutability-helper';
import cleanedData from './utils';
import AccordionTitle from './AccordionTitle';
import AccordionSection from './AccordionSection';
import './Accordion.css';

const data = cleanedData;

// accordion takes in directory structure data as a prop
export default class DragAndDropAccordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: {},
    };
    this.onCollectionClick = this.onCollectionClick.bind(this);
  }

  async componentDidMount() {
    // const { data } = this.props;
    // sets all collections to be closed in the accordion at first
    const activeIndex = {};
    data.collectionOrder.forEach((collection) => {
      Object.assign(activeIndex, {
        [collection]: false,
      });
    });
    await this.setState({
      activeIndex,
    });
  }

  async onCollectionClick(event) {
    const { id } = event.target;
    const collectionName = id.split('-').slice(0, -1).join('-'); // get the collection name
    await this.setState((currState) => ({
      ...currState,
      activeIndex: update(currState.activeIndex, {
        [collectionName]: {
          $set: !currState.activeIndex[collectionName],
        },
      }),
    }));
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <div className="accordion__section">
        {data.collectionOrder.map((collection) => ([
          <AccordionTitle
            collectionName={collection}
            onCollectionClick={this.onCollectionClick}
          />,
          data.collections[collection].pages.map((page) => (
            <AccordionSection pageName={page} isActive={activeIndex[collection]} />
          )),
        ]))}
      </div>
    );
  }
}
