import { ChainedCommands, findParentNode, Node } from "@tiptap/core"
import { NodeRange, Slice } from "@tiptap/pm/model"
import { EditorState } from "@tiptap/pm/state"
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react"

import { AccordionBackgroundType } from "types/editPage"

import { IsomerDetailGroupView } from "./IsomerDetailGroupView"

export interface IsomerDetailGroupOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: string
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    detailGroup: {
      setDetailsGroup: () => ReturnType
      appendDetail: (startPos: number, endPos: number) => ReturnType
      changeDetailGroupBackground: (
        backgroundColor: AccordionBackgroundType
      ) => ReturnType
    }
  }
}

export const IsomerDetailsGroup = Node.create<IsomerDetailGroupOptions>({
  name: "detailGroup",
  group: "block",
  atom: true,
  draggable: true,
  content: "details+",
  defining: true,
  isolating: true,
  allowGapCursor: false,

  addCommands() {
    return {
      setDetailsGroup: () => ({ chain, state }) => {
        const { schema, selection } = state

        const currNode = findParentNode((t) => t.type === this.type)(selection)

        const isInsideDetailGroup = currNode !== undefined

        if (isInsideDetailGroup) {
          // Do not allow inner accordions
          return false
        }
        const { $from: fromPos, $to: toPos } = selection
        const blockRange: NodeRange | null = fromPos.blockRange(toPos)

        // If there's no block range, return false
        if (!blockRange) return false

        const docSlice: Slice = state.doc.slice(
          blockRange.start,
          blockRange.end
        )

        // If the content doesn't match the schema, return false
        if (
          !schema.nodes.detailsContent.contentMatch.matchFragment(
            docSlice.content
          )
        ) {
          return false
        }
        const jsonContent = docSlice.toJSON()
        const content = jsonContent?.content ?? []

        // Insert new content and set the text selection

        return chain()
          .insertContentAt(
            { from: blockRange.start, to: blockRange.end },
            {
              type: this.name,
              attrs: { class: "isomer-accordion-group" },
              content: [
                {
                  type: "details",
                  attrs: { class: "isomer-accordion" },
                  content: [
                    { type: "detailsSummary" },
                    { type: "detailsContent", content },
                  ],
                },
              ],
            }
          )
          .setTextSelection(blockRange.start + 2)
          .run()
      },
      appendDetail: (startPos: number, endPos: number) => ({
        chain,
        state,
      }) => {
        const { schema } = state
        const start = state.doc.resolve(startPos)
        const end = state.doc.resolve(endPos)
        // get block range from start to end pos

        const blockRange: NodeRange | null = start.blockRange(end)

        // If there's no block range, return false
        if (!blockRange) return false

        const docSlice: Slice = state.doc.slice(
          blockRange.start,
          blockRange.end
        )

        // If the content doesn't match the schema, return false
        if (
          !schema.nodes.detailsContent.contentMatch.matchFragment(
            docSlice.content
          )
        ) {
          return false
        }
        const jsonContent = docSlice.toJSON()
        const existingContent = jsonContent?.content ?? []
        const { content } = existingContent[0]
        // Insert new content and set the text selection
        if (!content) {
          return false
        }

        return chain()
          .insertContentAt(
            { from: blockRange.start, to: blockRange.end },
            {
              type: this.name,
              content: [
                ...content,
                {
                  type: "details",
                  attrs: { class: "isomer-accordion" },
                  content: [
                    { type: "detailsSummary" },
                    {
                      type: "detailsContent",
                      content: [{ type: "paragraph", content: [] }],
                    },
                  ],
                },
              ],
            }
          )
          .run()
      },

      changeDetailGroupBackground: (
        backgroundColor: AccordionBackgroundType
      ) => ({ chain, state }) => {
        const { schema, selection } = state
        const { $from: start, $to: end } = selection

        // get block range from start to end pos
        const blockRange: NodeRange | null = start.blockRange(end)

        // If there's no block range, return false
        if (!blockRange) return false

        const docSlice: Slice = state.doc.slice(
          blockRange.start,
          blockRange.end
        )

        // If the content doesn't match the schema, return false
        if (
          !schema.nodes.detailsContent.contentMatch.matchFragment(
            docSlice.content
          )
        ) {
          return false
        }
        const jsonContent = docSlice.toJSON()
        const existingContent = jsonContent?.content ?? []
        const { content } = existingContent[0]
        // Insert new content and set the text selection
        if (!content) {
          return false
        }

        return chain()
          .insertContentAt(
            { from: blockRange.start, to: blockRange.end },
            {
              type: this.name,
              attrs: { backgroundColor },
              content: [...content],
            }
          )
          .run()
      },
      unsetDetailsGroup: () => ({
        chain,
        state,
      }: {
        state: EditorState
        chain: ChainedCommands
      }) => {
        const { selection } = state
        const currNode = findParentNode((t) => t.type === this.type)(selection)
        if (!currNode) return false
        const startPos = currNode.pos
        const range = { from: startPos, to: startPos + currNode.node.nodeSize }

        // TODO: check type
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return chain()
          .insertContentAt(range, [])
          .setTextSelection(startPos + 1)
          .run()
      },
    }
  },

  // TODO: add keyboard shortcuts for backspace
  // addKeyboardShortcuts() {
  //   return {
  //     "Backspace": () => this.editor.commands.detailGroup.setDetailsGroup(),
  //   }
  // }

  addAttributes() {
    return {
      backgroundColor: {
        default: "white",
      },
      class: {
        default: "isomer-accordion",
      },
      "data-type": {
        default: "details",
      },
    }
  },

  parseHTML() {
    return [{ tag: `div.isomer-accordion` }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const variant =
      node.attrs.backgroundColor === "gray"
        ? "isomer-accordion-gray"
        : "isomer-accordion-white"

    delete HTMLAttributes.backgroundColor
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
        class: `isomer-accordion ${variant}`,
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IsomerDetailGroupView)
  },
})
