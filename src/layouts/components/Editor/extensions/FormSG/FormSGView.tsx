import { Code } from "@chakra-ui/react"
import { NodeViewProps } from "@tiptap/react"

import { BlockWrapper } from "../../components/BlockWrapper"

export const FormSGView = ({ node, selected }: NodeViewProps) => {
  const formSrc = node.content.child(1).attrs.src

  return (
    <BlockWrapper name="Embed" isSelected={selected}>
      <Code paddingInline="0.75rem">{formSrc}</Code>
    </BlockWrapper>
  )
}
