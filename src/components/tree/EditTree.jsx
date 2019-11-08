import React, { Component } from 'react';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import data from './sampleData';
import TreeBuilder from './tree-builder';
import PropTypes from 'prop-types';

const rootNode = new TreeBuilder('root', 'root', '');

// data.directories.reduce
const dataIterator = (acc, item) => {
  if (item.children) {
    const newTree = acc.withSubTree(item.children.reduce(dataIterator, new TreeBuilder(item.name, item.type)));
    return newTree;
  }
  return acc.withLeaf(item.name, item.type, item.path);
};

const formattedTree = data.directory.reduce(dataIterator, rootNode);

const ListItem = ({ item, onExpand, onCollapse }) => {
  // Nested list
  if (item.children && item.children.length) {
    return item.isExpanded
      ? <button style={{ color: 'green' }} type="button" onClick={() => onCollapse(item.id)}>{ item.data ? item.data.title : 'no' }</button>
      : <button style={{ color: 'red' }} type="button" onClick={() => onExpand(item.id)}>{ item.data ? item.data.title : 'no' }</button>;
  }

  return <p>{ item.data ? item.data.title : 'no' }</p>;
};

ListItem.propTypes = PropTypes.shape({
  item: PropTypes.object,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}).isRequired;

export default class EditTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: formattedTree,
    };
  }

  onExpand = (itemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  onDragEnd = (
    source,
    destination,
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: newTree,
    });
  };

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
  }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <ListItem
        item={item}
        onExpand={onExpand}
        onCollapse={onCollapse}
      />
    </div>
  );

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    const { tree } = this.state;
    return (
      <Tree
        tree={tree}
        renderItem={this.renderItem}
        onExpand={this.onExpand}
        onCollapse={this.onCollapse}
        onDragEnd={this.onDragEnd}
        isNestingEnabled
        isDragEnabled
      />
    );
  }
}
