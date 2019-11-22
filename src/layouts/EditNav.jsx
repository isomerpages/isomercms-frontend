import React, { Component } from 'react';
import Tree, { mutateTree, moveItemOnTree } from '@atlaskit/tree';
import axios from 'axios';
import PropTypes from 'prop-types';
import TreeBuilder from '../utils/tree-builder';
import { dataIterator, ListItem, draggableWrapper, flattenTree, readTree } from '../utils/tree-utils';
import Header from '../components/Header';
import styles from '../styles/isomer-cms/pages/MenuEditor.module.scss';

const rootNode = new TreeBuilder('root', 'root', '');

export default class EditNav extends Component {
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
          new TreeBuilder('Unlinked', 'section'),
        ),
      );
      
      const testTree = flattenTree(tree);
      const testTree2 = readTree(testTree)

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
    const parent = this.getParentFromTreePosition({ tree, parentId });

    const childId = parent.children[index];

    return tree.items[childId];
  }

  getParentFromTreePosition = ({ tree, parentId }) => tree.items[parentId]

  onDragEnd = (
    source,
    destination,
  ) => {
    const { tree } = this.state;
   

    /**
     * `WIP`
     * In our drag'n'drop rules we need to specify the following:
     * 1) You can't drop items outside of the tree
     * 2) pages can be dropped anywhere but can't be merged into one another
     * 3) `collection`, `thirdnav` and `resource-room` can only be reordered at its current depth
     */
    // Rule 1)
    if (!destination) {
      return;
    }

    const sourceItemType = this.getItemFromTreePosition({
      tree, parentId: source.parentId, index: source.index,
    }).data.type;

    const sourceParentType = this.getParentFromTreePosition({
      tree, parentId: source.parentId,
    }).data.type;

    const destinationParent = this.getParentFromTreePosition({
      tree, parentId: destination.parentId,
    });

    const destinationParentType = destinationParent.data.type;

    switch (sourceItemType) {
      case 'page':
      case 'collection-page':
      case 'thirdnav-page':
        // Rule 2)
        if (!('index' in destination) && ['page', 'collection-page', 'thirdnav-page'].includes(destinationParentType)) return;
        break;
      case 'collection':
      case 'thirdnav':
      case 'resource room':
        // Rule 3)
        if (sourceParentType !== destinationParentType) return;
        break;
      default:
    }

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
  }) => {
    // Nodes of type `section` and the `Unlinked Pages` folder can't be dragged
    if (item.data.type !== 'section' && item.data.title !== 'Unlinked Pages') {
      return draggableWrapper(ListItem, item, onExpand, onCollapse, provided, snapshot);
    }
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <>
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div {...provided.dragHandleProps} />
          <ListItem
            item={item}
            onExpand={onExpand}
            onCollapse={onCollapse}
          />
        </div>
      </>
    );
  };

  // we need to encode all our information into the id, there is no way to retrieve it otherwise
  render() {
    const { tree } = this.state;
    return (
      tree
      && (
        <>
          <Header />
          <div className={styles.menuEditorSidebar}>
            <p className={styles.instructions}>Drag and drop pages to edit the menu</p>
            <Tree
              tree={tree}
              renderItem={this.renderItem}
              onExpand={this.onExpand}
              onCollapse={this.onCollapse}
              onDragEnd={this.onDragEnd}
              isNestingEnabled
              isDragEnabled
              offsetPerLevel={35}
            />
            <button type="button" className={styles.createNew}>
              <i className="bx bx-folder-plus" />
              Create a new folder
            </button>
            {/* <button type="button" className={styles.createNew}>
              <i className="bx bx-link" />
              Create an external link
            </button>
            <div className={styles.isDragging}>Item.isDragging</div>
            <div className={styles.isDraggingPlaceholderBox}>Item can drop in this box</div> */}
          </div>
        </>
      )
    );
  }
}

EditNav.propTypes = PropTypes.shape({
  history: PropTypes.object,
  location: PropTypes.object,
  match: {
    siteName: PropTypes.string,
  },
}).isRequired;
