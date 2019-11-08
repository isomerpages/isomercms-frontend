import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeBuilder from '../../utils/TreeBuilder';
import Tree from '@atlaskit/tree';

export default class AtlasTree extends Component {
  createTree = (treeData) => {
    const treeBuilder = new TreeBuilder(0, 'Linked Pages');
    const { directory } = treeData;
    // return this.populateTree(directory).build();
    const finalTree = this.iterateTree(directory.children, 0, treeBuilder).build();
    console.log(finalTree);
    return finalTree;


    // if (!treeData) {
      // return treeBuilder.build();
    // }

    // directory.forEach((directoryFile, index) => {
    //   if (directoryFile.type === 'collection') {
    //     const collectionTree = new TreeBuilder(index, directoryFile.name);
    //     directoryFile.children.forEach((collectionPage, collectionIndex) => {
    //       if (collectionPage.type === 'subcollection') {
            
    //       }

    //       collectionTree.withLeaf(collectionIndex, collection.fileName);
    //     });
    //     treeBuilder.withSubTree(collectionTree);

    //     return;
    //   }

    //   treeBuilder.withLeaf(index, item.fileName);
    // });

    // console.log(treeData);
    return treeBuilder.build();
  }

  populateTree = (data, idx, tree) => {
    const index = idx || 0;
    const treeBuilder = tree || new TreeBuilder(index);
    const hasChildren = !!data.children;


    if (!hasChildren) {
      return treeBuilder.withLeaf(index, 'No Child');
    }

    return this.populateTree(data, index + 1, tree);
  }

  iterateTree = (data, index, tree) => {
    if (data.length === index) {
      return tree;
    }
    if (data[index].children) {
      return this.iterateTree(data, index + 1, tree.withSubTree(this.iterateTree(data[index].children, 0, new TreeBuilder(0, data[index].name))));
    }
    return this.iterateTree(data, index + 1, tree.withLeaf(index, data[index].name));
  }


  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot
  }) => (
    <div
      ref={provided.innerRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...provided.draggableProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...provided.dragHandleProps}
    >
      <p>{ item.data ? item.data.title : 'Unknown' }</p>
    </div>
  )

  render() {
    const { treeData } = this.props;
    const tree = treeData ? this.createTree(treeData) : new TreeBuilder(0).build();

    return (
      <Tree
        tree={tree}
        renderItem={this.renderItem}
        isDragEnabled
        isNestingEnabled
      />
    );
  }
}

// AtlasTree.defaultProps = {
//   treeData: {
//     directory: [],
//     unlinkedPages: [],
//   },
// };

AtlasTree.propTypes = {
  treeData: PropTypes.shape({
    directory: PropTypes.array,
    unlinkedPages: PropTypes.array,
  }).isRequired,
};
