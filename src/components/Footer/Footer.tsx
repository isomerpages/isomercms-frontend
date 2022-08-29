import { HStack, Flex, FlexProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

export const Footer = ({
  children,
  ...rest
}: PropsWithChildren<FlexProps>): JSX.Element => (
  <Flex
    h="4rem"
    w="100%"
    pr="2rem"
    position="sticky"
    background="background.action.defaultInverse"
    border="1px"
    borderColor="border.divider.alt"
    justify="end"
    align="center"
    bottom="0"
    {...rest}
  >
    <HStack spacing="1rem">{children}</HStack>
  </Flex>
)
