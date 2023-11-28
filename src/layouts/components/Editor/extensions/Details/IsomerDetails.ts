import { mergeAttributes } from "@tiptap/react"
import Details from "@tiptap-pro/extension-details"

// NOTE: The reason for not using the default Details extension is because
// the position of the button is not configurable. We want the button to be
// on the right side of the summary text, not the left.
export const IsomerDetail = Details.extend({
  addNodeView() {
    return ({ editor, getPos, node, HTMLAttributes }) => {
      const outerDiv = document.createElement("div")
      const i = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
        class: "isomer-detail",
      })
      Object.entries(i).forEach(([key, value]) =>
        outerDiv.setAttribute(key, value)
      )
      const button = document.createElement("button")
      const content = document.createElement("div")

      outerDiv.append(content)
      outerDiv.append(button)
      const eventCallback = () => {
        outerDiv.classList.toggle(this.options.openClassName)
        const event = new Event("toggleDetailsContent")
        const selector = content.querySelector(
          ':scope > div[data-type="detailsContent"]'
        )
        if (selector != null) {
          selector.dispatchEvent(event)
        }
      }
      return (
        node.attrs.open && setTimeout(eventCallback),
        button.addEventListener("click", () => {
          if ((eventCallback(), this.options.persist)) {
            if (editor.isEditable && typeof getPos === "function") {
              const {
                from: selectionStart,
                to: selectionEnd,
              } = editor.state.selection
              editor
                .chain()
                .command(({ tr: t }) => {
                  const currPos = getPos()
                  const currNode = t.doc.nodeAt(currPos)
                  return (
                    currNode?.type === this.type &&
                    (t.setNodeMarkup(currPos, undefined, {
                      open: !currNode?.attrs.open,
                    }),
                    !0)
                  )
                })
                .setTextSelection({ from: selectionStart, to: selectionEnd })
                .focus(undefined, { scrollIntoView: !1 })
                .run()
            }
          } else editor.commands.focus()
        }),
        {
          dom: outerDiv,
          contentDOM: content,
          ignoreMutation: (t) =>
            !outerDiv.contains(t.target) || outerDiv === t.target,
          update: (t) => t.type === this.type,
        }
      )
    }
  },
})
