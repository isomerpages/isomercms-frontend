export default class TreeBuilder {
  constructor(rootId, title) {
    const rootItem = this.createItem(`${rootId}`, title);
    this.rootId = rootItem.id;
    this.items = {
      [rootItem.id]: rootItem,
    };
  }

  withLeaf(id, title) {
    const leafItem = this.createItem(`${this.rootId}-${id}`, title);
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
          i => `${this.rootId}-${i}`,
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

  createItem = (id, title) => {
    return ({
      id: `${id}`,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: `${title}`,
      },
    });
  };
}
