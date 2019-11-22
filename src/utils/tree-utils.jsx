import React from 'react';
import PropTypes from 'prop-types';
import TreeBuilder from './tree-builder';
import styles from '../styles/isomer-cms/pages/MenuEditor.module.scss';

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
  item, onExpand, onCollapse, isDragging,
}) => {
  // Nested list
  // if (item.children && item.children.length) {
  // since the top-level nodes 'navigation' and 'unlinked-pages' always have at least one child
  switch (item.data.type) {
    case 'section':
      return <div className={styles.treeTitle}><h2>{ item.data.title }</h2></div>;
    case 'thirdnav-page':
    case 'page':
    case 'collection-page':
    case 'resource room':
      return (
        <div className={styles.navGroup}>
          <i className="bx bx-box" style={{ opacity: 0 }} />
          <div className={styles.pageType}>
            <i className="bx bx-file-blank" />
            { item.data ? item.data.title : 'no' }
          </div>
        </div>
      );
    case 'collection':
    case 'thirdnav':
      return item.isExpanded
        ? (
          <div className={styles.navGroup} onClick={() => onCollapse(item.id)}>
            <i className="bx bx-chevron-down" />
            <div className={styles.pageType}>
              <i className="bx bx-folder-open" />
              { item.data ? item.data.title : 'no' }
            </div>
          </div>
        )
        : (
          <div className={styles.navGroup} onClick={() => onExpand(item.id)}>
            <i className="bx bx-chevron-right" />
            <div className={styles.pageType}>
              <i className="bx bx-folder" />
              { item.data ? item.data.title : 'no' }
            </div>
          </div>
        );
    default:
      return (
        <p>
          Unaccounted for!
          {' '}
          { item.data ? item.data.type : 'no' }
        </p>
      );
  }
};

const draggableWrapper = (WrappedComponent, item, onExpand, onCollapse, provided, snapshot) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <>
    <div className={styles.draggable} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <WrappedComponent
        item={item}
        onExpand={onExpand}
        onCollapse={onCollapse}
        isDragging={snapshot.isDragging}
      />
    </div>

  </>
);

// Function which reads the flattened tree array and returns the navigation elements
const readTree = (flattenedTree) => {
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
  readTree,
};

ListItem.propTypes = PropTypes.shape({
  item: PropTypes.object,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}).isRequired;
