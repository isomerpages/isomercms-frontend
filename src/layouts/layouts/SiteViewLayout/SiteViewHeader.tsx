import { Flex, Icon, Spacer, Text, HStack } from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { AvatarMenu } from "components/Header/AvatarMenu"
import { NotificationMenu } from "components/Header/NotificationMenu"
import { BiArrowBack } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

// TODO: This is a temporary header for a site view page
export const SiteViewHeader = (siteName: string): JSX.Element => {
  const { displayedName } = useLoginContext()
  return (
    <Flex
      py="0.625rem"
      px="2rem"
      borderBottom="1px solid"
      borderColor="border.divider.alt"
      bg="white"
      h="4rem"
    >
      <HStack spacing="1.25rem">
        <IconButton
          aria-label="Back to My sites"
          variant="clear"
          icon={
            <Icon as={BiArrowBack} fontSize="1.25rem" fill="icon.secondary" />
          }
          as={RouterLink}
          to="/sites"
        />
        <Text color="text.label" textStyle="body-1">
          Back to My sites
        </Text>
      </HStack>
      <Spacer />
      <HStack>
        <NotificationMenu siteName={siteName} />
        <AvatarMenu name={displayedName} />
      </HStack>
    </Flex>
  )
}
