import { Box } from "@chakra-ui/react"
import { NodeViewProps } from "@tiptap/react"

import { EditorCardsPlaceholderImage } from "assets"

import { BlockWrapper } from "../../components/BlockWrapper"

export const CardsView = ({ selected }: NodeViewProps) => {
  return (
    <BlockWrapper name="Cards grid" isSelected={selected}>
      <Box
        borderColor="base.divider.strong"
        borderWidth="1px"
        h="100%"
        w="100%"
      >
        <EditorCardsPlaceholderImage />
      </Box>
    </BlockWrapper>
  )
}
