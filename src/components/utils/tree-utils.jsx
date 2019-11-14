/*
  Constructs a new FlattenedItem
 */
const createFlattenedItem = (item, currentPath) => {
  return {
    item,
    path: currentPath,
  };
};

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

export default flattenTree;
