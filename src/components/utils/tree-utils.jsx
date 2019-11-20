import React from 'react';
import PropTypes from 'prop-types';
import TreeBuilder from './tree-builder';
import styles from '../../styles/isomer-cms/pages/MenuEditor.module.scss';

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
  item, onExpand, onCollapse, isDragging
}) => {

  // Nested list
  if (item.children && item.children.length) {
    // since the top-level nodes 'navigation' and 'unlinked-pages' always have at least one child
    if (item.data.type === 'section') {
      return <h2 className={styles.treeTitle} >{ item.data.title }</h2>;
    }

    return item.isExpanded
      ? <div className={styles.navGroup} onClick={() => onCollapse(item.id)}><i class='bx bx-chevron-down' ></i><div className={styles.pageType}><i class='bx bx-folder-open' ></i>{ item.data ? item.data.title : 'no' }</div></div>
      : <div className={styles.navGroup} onClick={() => onExpand(item.id)}><i class='bx bx-chevron-right' ></i><div className={styles.pageType}><i class='bx bx-folder' ></i>{ item.data ? item.data.title : 'no' }</div></div>;

  }

  return <div className={styles.navGroup}><i class='bx bx-box' style={{opacity: 0}}></i><div className={styles.pageType}><i class='bx bx-file-blank' ></i>{ item.data ? item.data.title : 'no' }</div></div>;
};

const draggableWrapper = (WrappedComponent, item, onExpand, onCollapse, provided, snapshot) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={styles.draggable} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
    <WrappedComponent
      item={item}
      onExpand={onExpand}
      onCollapse={onCollapse}
      isDragging={snapshot.isDragging}
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
