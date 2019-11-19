export default class TreeBuilder {
  constructor(rootId, type, path) {
    const rootItem = this.createItem(`${rootId}`, rootId, type, path);
    this.rootId = rootItem.id;
    this.items = {
      [rootItem.id]: rootItem,
    };
  }

  withLeaf(id, type, path) {
    const leafItem = this.createItem(`${this.rootId}-${id}`, id, type, path);
    this.addItemToRoot(leafItem.id);
    this.items[leafItem.id] = leafItem;
    return this;
  }

  withSubTree(tree) {
    const subTree = tree.build();
    this.addItemToRoot(`${this.rootId}-${subTree.rootId}`);

    Object.keys(subTree.items).forEach((itemId) => {
      const finalId = `${this.rootId}-${itemId}`;
      this.items[finalId] = {
        ...subTree.items[itemId],
        id: finalId,
        children: subTree.items[itemId].children.map(
          (i) => `${this.rootId}-${i}`,
        ),
      };
    });

    return this;
  }

  build() {
    return {
      rootId: this.rootId,
      items: this.items,
    };
  }

  addItemToRoot(id) {
    const rootItem = this.items[this.rootId];
    rootItem.children.push(id);
    rootItem.isExpanded = true;
    rootItem.hasChildren = true;
  }

  createItem = (id, title, type, path) => ({
    id: `${id}`,
    children: [],
    hasChildren: false,
    isExpanded: false,
    isChildrenLoading: false,
    data: {
      title: `${title}`,
      type: `${type}`,
      path: `${path}`,
    },
  });
}
