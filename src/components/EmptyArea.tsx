import { Box, Center, VStack, Text, HTMLChakraProps } from "@chakra-ui/react"
import { ReactFragment } from "react"

import { EmptyBoxImage } from "assets"

export interface EmptyAreaOption extends HTMLChakraProps<"div"> {
  isItemEmpty: boolean
  actionButton: ReactFragment
  mainText?: string
  subText?: string
}

export const EmptyArea = ({
  mainText,
  subText,
  actionButton,
  children,
  isItemEmpty,
}: EmptyAreaOption): JSX.Element => {
  return (
    <>
      {isItemEmpty ? (
        <Box as="form" w="full">
          {/* Resource Room does not exist */}
          <VStack spacing={5}>
            <EmptyBoxImage />
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
