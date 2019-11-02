import React, { Component } from 'react';
import DragAndDropAccordion from '../components/accordion/Accordion';

const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css';
document.head.appendChild(styleLink);

export default class CmsHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '',
    };
  }

  componentDidMount() {
    const { test } = this.state;
  }

  render() {
    // return <AccordionMenu />;
    return (
      <div>
        <DragAndDropAccordion />
      </div>
    );
  }
}
