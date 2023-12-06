import { Code } from "@chakra-ui/react"
import { NodeViewProps } from "@tiptap/react"

import { BlockWrapper } from "../../components/BlockWrapper"

export const InstagramView = ({ node, selected }: NodeViewProps) => {
  return (
    <BlockWrapper name="Embed" isSelected={selected}>
      <Code paddingInline="0.75rem" maxW="100%">
        {node.attrs.permalink}
      </Code>
    </BlockWrapper>
  )
}
