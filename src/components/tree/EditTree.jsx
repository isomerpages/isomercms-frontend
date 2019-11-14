import React, { Component } from 'react';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import axios from 'axios';
import PropTypes from 'prop-types';
import TreeBuilder from '../utils/tree-builder';
import { dataIterator, ListItem, draggableWrapper } from '../utils/tree-utils';

const rootNode = new TreeBuilder('root', 'root', '');

export default class EditTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: null,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { siteName } = match.params;
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/tree`, {
        withCredentials: true,
      });
      const { directory, unlinked } = resp.data;

      // add a root node for the navigation bar
      const tree = rootNode.withSubTree(
        directory.reduce(
          dataIterator,
          new TreeBuilder('Navigation', 'navigation'),
        ),
      // add a root node for the unlinked pages
      ).withSubTree(
        unlinked.reduce(
          dataIterator,
          new TreeBuilder('Unlinked Pages', 'unlinked-pages'),
        ),
      );

      this.setState({ tree });
    } catch (err) {
      console.log(err);
    }
  }

  onExpand = (itemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId) => {
    const { tree } = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  getItemFromTreePosition = ({ tree, parentId, index }) => {
    const parent = this.getParentFromTreeposition({ tree, parentId });

    const childId = parent.children[index];

    return tree.items[childId];
  }

  getParentFromTreeposition = ({ tree, parentId }) => tree.items[parentId]

  onDragEnd = (
    source,
    destination,
  ) => {
    const { tree } = this.state;

    /**
     * `WIP`
     * In our drag'n'drop rules we need to specify the following:
     * 1) You can't merge any item into another [ `!(index in destination)` ]
     * 2) `collection` & `thirdnav` can only be reordered at its current depth
     */
    if (!destination || !('index' in destination)) {
      return;
    }
    const sourceItemType = this.getItemFromTreePosition({
      tree, parentId: source.parentId, index: source.index,
    }).data.type;
    const destinationParentType = this.getParentFromTreeposition({
      tree, parentId: destination.parentId,
    }).data.type;

    // Rule 2) From above
    if (sourceItemType === 'collection' && destinationParentType !== 'root') return;
    if (sourceItemType === 'thirdnav' && destinationParentType !== 'collection') return;

    // console.log(tree.items[source.parentId].data, tree.items[destination.parentId].data);
    // console.log(source, destination);
    console.log(sourceItemType, destinationParentType);

    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: newTree,
    });
  };

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }) => (
    draggableWrapper(ListItem, item, onExpand, onCollapse, provided)
  );

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    const { tree } = this.state;
    return (
      tree
      && (
      <Tree
        tree={tree}
        renderItem={this.renderItem}
        onExpand={this.onExpand}
        onCollapse={this.onCollapse}
        onDragEnd={this.onDragEnd}
        isNestingEnabled
        isDragEnabled
      />
      )
    );
  }
}

EditTree.propTypes = PropTypes.shape({
  history: PropTypes.object,
  location: PropTypes.object,
  match: {
    siteName: PropTypes.string,
  },
}).isRequired;
