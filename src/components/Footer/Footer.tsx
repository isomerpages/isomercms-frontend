import { HStack, Flex } from "@chakra-ui/react"

export interface FooterProps {
  children: JSX.Element
}

export const Footer = ({ children }: FooterProps): JSX.Element => (
  <Flex
    h="80px"
    w="100%"
    pr="30px"
    position="fixed"
    background="background.action.defaultInverse"
    border="1px"
    borderColor="border.divider.alt"
    justify="end"
    align="center"
    bottom="0"
  >
    <HStack>
      <>{children}</>
    </HStack>
  </Flex>
)
