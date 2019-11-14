import React from 'react';
import PropTypes from 'prop-types';
import TreeBuilder from './tree-builder';

/*
  Constructs a new FlattenedItem
 */
const createFlattenedItem = (item, currentPath) => (
  {
    item,
    path: currentPath,
  }
);

/*
  Flatten the children of the given subtree
*/
const flattenChildren = (tree, item, currentPath) => (
  item.isExpanded
    ? flattenTree({ rootId: item.id, items: tree.items }, currentPath)
    : []
);

/*
  Transforms tree structure into flat list of items for rendering purposes.
  We recursively go through all the elements and its children first on each level
 */
const flattenTree = (tree, path = []) => (
  tree.items[tree.rootId]
    ? tree.items[tree.rootId].children.reduce(
      (accum, itemId, index) => {
        // iterating through all the children on the given level
        const item = tree.items[itemId];
        const currentPath = [...path, index];
        // we create a flattened item for the current item
        const currentItem = createFlattenedItem(item, currentPath);
        // we flatten its children
        const children = flattenChildren(tree, item, currentPath);
        // append to the accumulator
        return [...accum, currentItem, ...children];
      },
      [],
    )
    : []
);

/**
 * A reducing function which recursively builds the tree
*/
const dataIterator = (acc, item) => {
  if (item.children) {
    const newTree = acc.withSubTree(
      item.children.reduce(dataIterator, new TreeBuilder(item.title, item.type)),
    );
    return newTree;
  }
  return acc.withLeaf(item.title, item.type);
};

/**
 * For future uses, dragState currently stores information
 * that can be used for future purposes but are not needed currently
 */
const ListItem = ({
  item, onExpand, onCollapse,
}) => {
  // Nested list
  if (item.children && item.children.length) {
    // since the top-level nodes 'navigation' and 'unlinked-pages' always have at least one child
    if (item.data.type === 'navigation' || item.data.type === 'unlinked-pages') {
      return <p>{ item.data.title }</p>;
    }

    return item.isExpanded
      ? <button style={{ color: 'green' }} type="button" onClick={() => onCollapse(item.id)}>{ item.data ? item.data.title : 'no' }</button>
      : <button style={{ color: 'red' }} type="button" onClick={() => onExpand(item.id)}>{ item.data ? item.data.title : 'no' }</button>;
  }

  return <div>{ item.data ? item.data.title : 'no' }</div>;
};

const draggableWrapper = (WrappedComponent, item, onExpand, onCollapse, provided) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
    <WrappedComponent
      item={item}
      onExpand={onExpand}
      onCollapse={onCollapse}
    />
  </div>
);

export {
  flattenTree,
  dataIterator,
  ListItem,
  draggableWrapper,
};

ListItem.propTypes = PropTypes.shape({
  item: PropTypes.object,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}).isRequired;
