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
    if (item.data.type === 'section') {
      return <p>{ item.data.title }</p>;
    }

    return item.isExpanded
      ? <button style={{ color: 'green' }} type="button" onClick={() => onCollapse(item.id)}>{ item.data ? item.data.title : 'no' }</button>
      : <button style={{ color: 'red' }} type="button" onClick={() => onExpand(item.id)}>{ item.data ? item.data.title : 'no' }</button>;
  }

  return <div>{ item.data ? item.data.title : 'no' }</div>;
};

// HOC which wraps a component in a draggable
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

// Function which reads the flattened tree array and returns the navigation elements
const treeReader = (flattenedTree) => {
  // Create a tree object to store the tree data
  const treeObject = [];

  // Counters to keep track of tree depth level
  let prevDepth = 1;
  let currDepth = 1;

  // Counters to keep track of collection level
  let collectionIdx = -1;
  let leftNavIdx = -1;


  for (let i = 1; i < flattenedTree.length; ++i) {
    const { item: { data }, path } = flattenedTree[i];
    const { title, type } = data;

    // Break the for loop once we reach Unlinked Pages
    if (path[0] === 1) {
      break;
    }

    // Set the current depth
    currDepth = path.length;

    switch (currDepth) {
      case 2:
        // Add the collection to the tree object
        treeObject.push({
          title,
          type,
        });
        // Increment collection counter
        collectionIdx += 1;

        if (currDepth < prevDepth) {
          leftNavIdx = -1;
        }
        break;
      case 3:
        // Add the collection page or thirdnav to the tree
        if (currDepth > prevDepth) {
          treeObject[collectionIdx].leftNavPages = [{
            title,
            type,
          }];
        } else {
          treeObject[collectionIdx].leftNavPages.push({
            title,
            type,
          });
        }
        // Increment leftnav counter
        leftNavIdx += 1;
        break;
      case 4:
        // Add the thirdnav page to the tree
        if (currDepth > prevDepth) {
          treeObject[collectionIdx].leftNavPages[leftNavIdx].children = [{
            title,
            type,
          }];
        } else {
          treeObject[collectionIdx].leftNavPages[leftNavIdx].children.push({
            title,
            type,
          });
        }
        break;
      default:
        throw Error('Tree contains invalid data - Isomer does not support items greater than depth level 4');
    }

    // Set the prev depth = current depth
    prevDepth = currDepth;
  }

  return treeObject;
};

export {
  flattenTree,
  dataIterator,
  ListItem,
  draggableWrapper,
  treeReader,
};

ListItem.propTypes = PropTypes.shape({
  item: PropTypes.object,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}).isRequired;
