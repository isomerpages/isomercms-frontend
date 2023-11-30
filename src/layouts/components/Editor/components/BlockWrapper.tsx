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
          top="-2px"
          left="-2px"
          backgroundColor="#055AFF"
          textColor="white"
          p="0.25rem"
        >
          <Text textStyle="caption-1">{name}</Text>
        </Box>

        <Box
          _hover={{
            outline: "2px solid #055AFF",
          }}
          outline={isSelected ? "2px solid #055AFF" : undefined}
          p="0.75rem"
          objectFit="contain"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
