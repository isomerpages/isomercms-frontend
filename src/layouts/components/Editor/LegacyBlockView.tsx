import { Box, Text } from "@chakra-ui/react"
import {
  NodeViewContent,
  NodeViewProps,
  NodeViewRendererProps,
  NodeViewWrapper,
  ReactNodeViewRendererOptions,
} from "@tiptap/react"

// .react-component {
//     background: #FAF594;
//     border: 3px solid #0D0D0D;
//     border-radius: 0.5rem;
//     margin: 1rem 0;
//     position: relative;

//     .label {
//       margin-left: 1rem;
//       background-color: #0D0D0D;
//       font-size: 0.6rem;
//       letter-spacing: 1px;
//       font-weight: bold;
//       text-transform: uppercase;
//       color: #fff;
//       position: absolute;
//       top: 0;
//       padding: 0.25rem 0.75rem;
//       border-radius: 0 0 0.5rem 0.5rem;
//     }

//     .content {
//       margin-top: 1.5rem;
//       padding: 1rem;
//     }
//   }

export const LegacyBlockView = ({ node }: NodeViewProps) => {
  console.log(node)

  return (
    <Box
      as={NodeViewWrapper}
      bg="#FAF594"
      border="3px solid #0d0d0d"
      borderRadius="0.5rem"
      margin="1rem 0"
      position="relative"
    >
      <Text
        ml="1rem"
        bgColor="#0d0d0d"
        textStyle="caption-1"
        fontWeight="bold"
        color="#fff"
        position="absolute"
        top="0"
        padding="0.25rem 0.75rem"
        borderRadius="0 0 0.5rem 0.5rem"
      >
        Legacy
      </Text>
      <Box mt="1.5rem" p="1rem">
        {node.attrs.src}
      </Box>
    </Box>
  )
}
