import React, { Component } from 'react';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import axios from 'axios';
import PropTypes from 'prop-types';
import data from './sampleData';
import TreeBuilder from './tree-builder';
import flattenTree from './utils/utils';

const rootNode = new TreeBuilder('root', 'root', '');

// data.directories.reduce
const dataIterator = (acc, item) => {
  if (item.children) {
    const newTree = acc.withSubTree(
      item.children.reduce(dataIterator, new TreeBuilder(item.title, item.type)),
    );
    return newTree;
  }
  return acc.withLeaf(item.title, item.type);
};

// const formattedTree = data.directory.reduce(dataIterator, rootNode);

/**
 * For future uses, dragState currently stores information
 * that can be used for future purposes but are not needed currently
 */
const ListItem = ({
  item, onExpand, onCollapse, dragState,
}) => {
  // Nested list
  if (item.children && item.children.length) {
    return item.isExpanded
      ? <button style={{ color: 'green' }} type="button" onClick={() => onCollapse(item.id)}>{ item.data ? item.data.title : 'no' }</button>
      : <button style={{ color: 'red' }} type="button" onClick={() => onExpand(item.id)}>{ item.data ? item.data.title : 'no' }</button>;
  }

  return <p>{ item.data ? item.data.title : 'no' }</p>;
};

ListItem.propTypes = PropTypes.shape({
  item: PropTypes.object,
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,
}).isRequired;

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
      const { directory } = resp.data;
      const dabdab = directory.reduce(dataIterator, rootNode);
      this.setState({ tree: dabdab });
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
    snapshot,
  }) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <ListItem
        item={item}
        onExpand={onExpand}
        onCollapse={onCollapse}
        dragState={snapshot}
      />
    </div>
  );

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    const { tree } = this.state;
    return (
      tree
      && (<Tree
          tree={tree}
          renderItem={this.renderItem}
          onExpand={this.onExpand}
          onCollapse={this.onCollapse}
          onDragEnd={this.onDragEnd}
          isNestingEnabled
          isDragEnabled
        />)
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
