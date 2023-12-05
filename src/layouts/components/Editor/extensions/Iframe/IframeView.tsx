import { Code } from "@chakra-ui/react"
import { NodeViewProps } from "@tiptap/react"

import { BlockWrapper } from "../../components/BlockWrapper"

export const IframeView = ({ node, selected }: NodeViewProps) => {
  return (
    <BlockWrapper name="Embed" isSelected={selected}>
      <Code paddingInline="0.75rem"> {node.attrs.src}</Code>
    </BlockWrapper>
  )
}
