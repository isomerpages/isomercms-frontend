import { HStack, Flex } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export const Footer = ({
  children,
}: PropsWithChildren<Record<never, any>>): JSX.Element => (
  <Flex
    h="5rem"
    w="100%"
    pr="2rem"
    position="sticky"
    background="background.action.defaultInverse"
    border="1px"
    borderColor="border.divider.alt"
    justify="end"
    align="center"
    bottom="0"
  >
    <HStack>{children}</HStack>
  </Flex>
)
