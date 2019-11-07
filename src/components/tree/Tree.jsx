/* eslint-disable no-multiple-empty-lines */
import React from 'react';
import Tree, {
  mutateTree,
  moveItemOnTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import TreeBuilder from './tree-builder';
import data from './sampleData.json';


const Tree2 = ({tree, renderItem}) => {

  return (
    <div>
      <Tree
        tree={tree}
        renderItem={renderItem}
      />
    </div>
  )
}

export default Tree2;