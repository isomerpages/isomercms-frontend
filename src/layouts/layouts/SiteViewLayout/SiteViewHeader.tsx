import {
  Flex,
  Icon,
  Spacer,
  Text,
  HStack,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { BiArrowBack } from "react-icons/bi"
import { Link as RouterLink, useLocation, useParams } from "react-router-dom"

import { AvatarMenu } from "components/Header/AvatarMenu"
import { NotificationMenu } from "components/Header/NotificationMenu"

import { ISOMER_GUIDE_LINK } from "constants/config"

import { useLoginContext } from "contexts/LoginContext"

export const SiteViewHeader = (): JSX.Element => {
  const { displayedName } = useLoginContext()
  const { pathname } = useLocation()
  const isAtSiteDashboard = pathname.endsWith("dashboard")
  const { siteName } = useParams<{ siteName: string }>()
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
          aria-label={`Back to ${
            isAtSiteDashboard ? "my sites" : "site dashboard"
          }`}
          variant="clear"
          icon={
            <Icon as={BiArrowBack} fontSize="1.25rem" fill="icon.secondary" />
          }
          as={RouterLink}
          to={isAtSiteDashboard ? "/sites" : `/sites/${siteName}/dashboard`}
        />
        <Text color="text.label" textStyle="body-1">
          {isAtSiteDashboard ? "My sites" : "Site dashboard"}
        </Text>
      </HStack>
      <Spacer />
      <HStack>
        <LinkBox position="relative">
          <LinkOverlay href={ISOMER_GUIDE_LINK} isExternal>
            <Text
              color="text.link.dark"
              noOfLines={1}
              textStyle="subhead-1"
              fontSize="1rem"
            >
              Get help
            </Text>
          </LinkOverlay>
        </LinkBox>
        <NotificationMenu />
        <AvatarMenu name={displayedName} />
      </HStack>
    </Flex>
  )
}
