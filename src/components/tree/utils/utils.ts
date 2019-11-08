import {
  FlattenedItem,
  Path,
  TreeData,
  TreeItem,
} from './types';


/*
  Transforms tree structure into flat list of items for rendering purposes.
  We recursively go through all the elements and its children first on each level
 */
const flattenTree = (tree: TreeData, path: Path = []): FlattenedItem[] =>
  tree.items[tree.rootId]
    ? tree.items[tree.rootId].children.reduce<FlattenedItem[]>(
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
    : [];

/*
  Constructs a new FlattenedItem
 */
const createFlattenedItem = (
  item: TreeItem,
  currentPath: Path,
): FlattenedItem => {
  return {
    item,
    path: currentPath,
  };
};

/*
  Flatten the children of the given subtree
*/
const flattenChildren = (tree: TreeData, item: TreeItem, currentPath: Path) => {
  return item.isExpanded
    ? flattenTree({ rootId: item.id, items: tree.items }, currentPath)
    : [];
};

export default flattenTree;