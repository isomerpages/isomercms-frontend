import { Node } from "@tiptap/core"
import { NodeRange, Slice } from "@tiptap/pm/model"
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react"

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
    }
  }
}

export const IsomerDetailsGroup = Node.create<IsomerDetailGroupOptions>({
  name: "detailGroup",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,

  content: "details+",

  addCommands() {
    return {
      setDetailsGroup: () => ({ chain, state }) => {
        const { schema, selection } = state
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
    }
  },

  addAttributes() {
    return {
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

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
        class: "isomer-accordion",
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IsomerDetailGroupView)
  },
})
