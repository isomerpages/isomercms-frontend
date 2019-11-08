import React, { Component } from 'react';
import { Tree } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

const { TreeNode } = Tree;

export default class AntTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: null,
    };
  }

  createTree = (treeData) => {
    const tree = [];
    const { directory, unlinkedPages } = treeData;
    directory.forEach((item) => {
      const collectionPages = [];
      switch (item.type) {
        case 'page':
          tree.push(<TreeNode title={item.fileName} />);
          break;
        case 'collection':
          item.children.forEach((collectionPage) => {
            switch (collectionPage.type) {
              case 'leftnav':
                collectionPages.push(<TreeNode title={collectionPage.fileName} />);
                break;
              case 'subcollection':
                collectionPages.push(
                  <TreeNode title="subcollection">
                    {
                      collectionPage.children.map(
                        (subCollectionPage) => <TreeNode title={subCollectionPage.fileName} />,
                      )
                    }
                  </TreeNode>,
                );
                break;
              default:
                break;
            }
          });
          tree.push(<TreeNode title={item.name}>{ collectionPages }</TreeNode>);
          break;
        default:
          break;
      }
    });
    console.log(tree);
    return tree;
  }

  render() {
    const { treeData } = this.props;

    return (
      <Tree
        draggable
        onDrop={(e) => console.log(e)}
      >
        { treeData && this.createTree(treeData) }
      </Tree>
    );
  }
}

AntTree.propTypes = {
  treeData: PropTypes.object.isRequired,
};
