import { Box, Text } from "@chakra-ui/react"
import { NodeViewWrapper } from "@tiptap/react"
import { PropsWithChildren } from "react"

interface BlockWrapperProps {
  name: string
  isSelected: boolean
}

export const BlockWrapper = ({
  name,
  isSelected,
  children,
}: PropsWithChildren<BlockWrapperProps>): JSX.Element => {
  return (
    <Box as={NodeViewWrapper} data-drag-handle>
      <Box position="relative" maxW="36.5rem" data-group>
        <Box
          _groupHover={{
            display: "block",
          }}
          position="absolute"
          display={isSelected ? "block" : "none"}
          top="0px"
          left="0px"
          backgroundColor="#055AFF"
          textColor="white"
          p="0.25rem"
        >
          <Text textStyle="caption-1">{name}</Text>
        </Box>

        <Box
          _hover={{
            border: "2px solid #055AFF",
          }}
          // NOTE: Set transparent border to prevent resize on hover
          // as border will affect calculated width and height
          border={isSelected ? "2px solid #055AFF" : "2px solid transparent"}
          p="0.75rem"
          objectFit="contain"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
