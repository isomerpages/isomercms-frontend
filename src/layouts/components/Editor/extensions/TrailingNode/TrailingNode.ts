import { Extension } from "@tiptap/core"
import { Node as ProseMirrorNode, NodeType } from "@tiptap/pm/model"
import { Plugin, PluginKey } from "@tiptap/pm/state"

function isNodeInArray({
  node,
  types,
}: {
  node: ProseMirrorNode | null
  types: NodeType[]
}) {
  if (!node) return false

  return Array.isArray(types) && types.includes(node.type)
}

/**
 * Extension based on:
 * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
 * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
 */

export interface TrailingNodeOptions {
  node: string
  notAfter: string[]
}

export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: "trailingnode",

  addOptions() {
    return {
      node: "paragraph",
      notAfter: ["paragraph"],
    }
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter((node) => this.options.notAfter.includes(node.name))

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldInsertNodeAtEnd = plugin.getState(state)
          const endPosition = doc.content.size
          const type = schema.nodes[this.options.node]

          if (shouldInsertNodeAtEnd) {
            return tr.insert(endPosition, type.create())
          }

          return null
        },
        state: {
          init: (_, state) => {
            const lastNode = state.tr.doc.lastChild

            return !isNodeInArray({ node: lastNode, types: disabledNodes })
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value
            }

            const lastNode = tr.doc.lastChild

            return !isNodeInArray({ node: lastNode, types: disabledNodes })
          },
        },
      }),
    ]
  },
})
