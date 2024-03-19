import { Box, Text } from "@chakra-ui/react"
import { NodeViewWrapper } from "@tiptap/react"
import { PropsWithChildren } from "react"

import "./styles.scss"

interface BlockWrapperProps {
  name: string
  isSelected: boolean
  childButtons?: JSX.Element
}

export const BlockWrapper = ({
  name,
  isSelected,
  childButtons,
  children,
}: PropsWithChildren<BlockWrapperProps>): JSX.Element => {
  return (
    <Box as={NodeViewWrapper}>
      <Box position="relative" maxW="36.5rem" data-group>
        {isSelected && <>{childButtons}</>}
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
          mt="-0.75rem"
        >
          <Text textStyle="caption-1" contentEditable="false">
            {name}
          </Text>
        </Box>
        <Box
          className="drag-handle"
          contentEditable="false"
          draggable="true"
          data-drag-handle
        />
        <Box
          _hover={{
            border: "2px solid #055AFF",
          }}
          // NOTE: Set transparent border to prevent resize on hover
          // as border will affect calculated width and height
          border={isSelected ? "2px solid #055AFF" : "2px solid transparent"}
          objectFit="contain"
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
