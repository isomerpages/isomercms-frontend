import { Box, Flex, VStack, StackDivider, BoxProps } from "@chakra-ui/react"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import { useLocation, useRouteMatch } from "react-router-dom"

/**
 * @precondition This component MUST only be used when there is a sitename. \
 * This means that this component has to be used within the main CMS section after clicking the site card
 */
export const SiteViewLayout = ({
  children,
  ...rest
}: BoxProps): JSX.Element => {
  const {
    params: { siteName },
  } = useRouteMatch<{ siteName: string }>()
  const { pathname } = useLocation()

  return (
    <Box {...rest}>
      <Header siteName={siteName} />
      {/* main bottom section */}
      <Flex>
        <Sidebar siteName={siteName} currPath={pathname} />
        <VStack
          p="2rem"
          spacing="2rem"
          bgColor="gray.50"
          w="100%"
          divider={<StackDivider borderColor="border.divider.alt" />}
        >
          {/* main section ends here */}
          {children}
        </VStack>
      </Flex>
    </Box>
  )
}
