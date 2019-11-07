import React, { Component } from 'react';
import TreeBuilder from './tree-builder';
import Tree2 from './Tree';
import data from './sampleData';

const tree = new TreeBuilder('root', 'root', '');

// data.directories.reduce
const dataIterator = (acc, item) => {
  if (item.children) {
    const newTree = acc.withSubTree(item.children.reduce(dataIterator, new TreeBuilder(item.name, item.type)));
    return newTree;
  }
  return acc.withLeaf(item.name, item.type, item.path);
};

const a = data.directory.reduce(dataIterator, tree);
console.log(a);

export default class EditPage extends Component {
  
  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
  }) => {
    console.log(item)
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <p>
          {item.data ? item.data.title : ''}
        </p>        
      </div>
    );
  };

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    return (
      <Tree2
        tree={a}
        renderItem={this.renderItem}
      />
    )
  }
}