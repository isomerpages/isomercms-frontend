import React, { Component } from 'react';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import axios from 'axios';
import PropTypes from 'prop-types';
import TreeBuilder from '../utils/tree-builder';
import { dataIterator, ListItem, draggableWrapper } from '../utils/tree-utils';
import Header from '../../components/Header';
import styles from '../../styles/isomer-cms/pages/MenuEditor.module.scss';

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
          new TreeBuilder('Main Menu', 'section'),
        ),
      // add a root node for the unlinked pages
      ).withSubTree(
        unlinked.reduce(
          dataIterator,
          new TreeBuilder('Unlinked Pages', 'section'),
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
     * 1) You can't drop items outside of the tree
     * 2) You can't merge any item into another unless they are under the same parent
     * 3) `collection` & `thirdnav` can only be reordered at its current depth
     */
    // Rule 1)
    if (!destination) {
      return;
    }

    const sourceItemType = this.getItemFromTreePosition({
      tree, parentId: source.parentId, index: source.index,
    }).data.type;

    const sourceParentType = this.getParentFromTreeposition({
      tree, parentId: source.parentId, index: source.index,
    }).data.type;

    const destinationParentType = this.getParentFromTreeposition({
      tree, parentId: destination.parentId,
    }).data.type;

    // Rule 2)
    if (!('index' in destination) && sourceParentType !== destinationParentType) return;

    // Rule 3)
    if (sourceItemType === 'collection' && destinationParentType !== 'section') return;
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
  }) => {
    if (item.data.type !== 'section') {
      return draggableWrapper(ListItem, item, onExpand, onCollapse, provided);
    }
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <div {...provided.dragHandleProps}/>
        <ListItem
          item={item}
          onExpand={onExpand}
          onCollapse={onCollapse}
        />
      </div>
    );
  };

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    const { tree } = this.state;
    return (
      tree
      && (
      <div>
        <Header/>
        <div className={styles.menuEditorSidebar}>
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onDragEnd={this.onDragEnd}
            isNestingEnabled
            isDragEnabled
          />
        </div>
      </div>
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
