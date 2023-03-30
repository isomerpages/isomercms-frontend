import { Box, Center, VStack, Text, HTMLChakraProps } from "@chakra-ui/react"

import { EmptyBlueBoxImage } from "assets"

export interface EmptyAreaProps extends HTMLChakraProps<"div"> {
  isItemEmpty: boolean
  actionButton: JSX.Element
  mainText?: string
  subText?: string
}

export const EmptyArea = ({
  mainText,
  subText,
  actionButton,
  children,
  isItemEmpty,
  ...rest
}: EmptyAreaProps): JSX.Element => {
  return (
    <>
      {isItemEmpty ? (
        <Box w="full">
          {/* Resource Room does not exist */}
          <VStack spacing={5} {...rest}>
            <EmptyBlueBoxImage />
            <Center>
              <VStack spacing={0}>
                <Text textStyle="subhead-1">
                  {mainText || " There's nothing here yet. "}
                </Text>
                <Text textStyle="body-2">
                  {subText || "Create a new item to get started."}
                </Text>
              </VStack>
            </Center>
            {actionButton}
          </VStack>
        </Box>
      ) : (
        children
      )}
    </>
  )
}
