import {
  forwardRef,
  Box,
  Divider,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  Icon,
  HStack,
  Flex,
  Skeleton,
  Spacer,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react"
import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"
import {
  BiBook,
  BiBuoy,
  BiCog,
  BiCubeAlt,
  BiFileBlank,
  BiGridAlt,
  BiImage,
  BiLogOutCircle,
} from "react-icons/bi"
import { useParams, Link as RouterLink, useLocation } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLastUpdated } from "hooks/useLastUpdated"
import { useLocalStorage } from "hooks/useLocalStorage"
import useRedirectHook from "hooks/useRedirectHook"

import { TabSection } from "types/sidebar"

// NOTE: This is a workaround. We should have a context set up and let this all be within 1 page
// rather than using URL params
const getSelectedTab = (url: string[]): TabSection => {
  const mainSection = url[2]
  if (mainSection === "folders" || mainSection === "workspace") {
    return "workspace"
  }

  if (mainSection === "resourceRoom" || mainSection === "settings") {
    return mainSection
  }

  return url[3] as TabSection
}

const getTabIndex = (section: TabSection) => {
  switch (section) {
    case "workspace":
      return 0
    case "resourceRoom":
      return 1
    case "images":
      return 2
    case "files":
      return 3
    case "settings":
      return 4
    default: {
      const exception: never = section
      throw new Error(exception)
    }
  }
}

export const Sidebar = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { pathname } = useLocation<{ pathname: string }>()
  const { lastUpdated, isError, isLoading } = useLastUpdated(siteName)
  const [loggedInUser] = useLocalStorage(
    LOCAL_STORAGE_KEYS.GithubId,
    "Unknown user"
  )
  // NOTE: As this is a sub-path, there's a leading / which is converted into an empty string
  const selectedTab = getSelectedTab(pathname.split("/").filter(Boolean))
  const { setRedirectToLogout } = useRedirectHook()
  return (
    // NOTE: This is because we reserve height for the header (4rem)
    <Flex
      bg="white"
      h="calc(100vh - 4rem)"
      flexDir="column"
      w="15rem"
      borderRight="1px solid"
      borderColor="border.divider.alt"
    >
      <Box p="1.5rem">
        <VStack align="flex-start" spacing="0.5rem">
          <Text
            as="h4"
            textStyle="h4"
            color="text.title.brandSecondary"
            w="100%"
          >
            {siteName}
          </Text>
          <Skeleton isLoaded={!isLoading} w="100%">
            <Text textStyle="caption-2" color="text.description" w="full">
              {isError ? "Unable to retrieve data" : lastUpdated}
            </Text>
          </Skeleton>
        </VStack>
      </Box>
      <Divider color="secondary.100" />
      <Tabs
        orientation="vertical"
        variant="line-vertical"
        // NOTE: This is a workaround as routes don't play well with tabs
        defaultIndex={getTabIndex(selectedTab)}
      >
        <TabList
          w="100%"
          // NOTE: There's a 2px box-shadow applied on focus.
          // This means that we need to reserve space to allow for the box-shadow to show
          // Otherwise, the focus-ring will be clipped
          pt="calc(0.5rem - 2px)"
          pb="2px"
          paddingInlineEnd="2px"
        >
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/workspace`}
            isSelected={selectedTab === "workspace"}
          >
            <TabLabel icon={BiCubeAlt}>My Workspace</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/resourceRoom`}
            isSelected={selectedTab === "resourceRoom"}
          >
            <TabLabel icon={BiGridAlt}>Resources</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/media/images/mediaDirectory/images`}
            isSelected={selectedTab === "images"}
          >
            <TabLabel icon={BiImage}>Images</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/media/files/mediaDirectory/files`}
            isSelected={selectedTab === "files"}
          >
            <TabLabel icon={BiFileBlank}>Files</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/settings`}
            isSelected={selectedTab === "settings"}
          >
            <TabLabel icon={BiCog}>Site Settings</TabLabel>
          </Tab>
        </TabList>
      </Tabs>
      <Spacer />
      <Divider color="secondary.100" />
      <LinkBox>
        <LinkOverlay
          rel="noopener noreferrer"
          target="_blank"
          href="https://go.gov.sg/isomercms-guide/"
        >
          <SidebarButton leftIcon={<Icon as={BiBook} fontSize="1.5rem" />}>
            <Text textStyle="body-1">Guide</Text>
          </SidebarButton>
        </LinkOverlay>
      </LinkBox>
      <LinkBox>
        <LinkOverlay
          href="https://go.gov.sg/isomer-cms-help"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SidebarButton leftIcon={<Icon as={BiBuoy} fontSize="1.5rem" />}>
            <Text textStyle="body-1">Help</Text>
          </SidebarButton>
        </LinkOverlay>
      </LinkBox>
      <Divider color="secondary.100" />
      <VStack spacing="2rem" pt="0.5rem">
        <SidebarButton
          isFullWidth
          display="block"
          onClick={setRedirectToLogout}
        >
          <Flex w="100%">
            <Text textStyle="body-1">Logout</Text>
            <Spacer />
            <Icon as={BiLogOutCircle} fontSize="1.5rem" />
          </Flex>
        </SidebarButton>
        <Box px="1rem" textColor="text.link.disabled" textAlign="left" w="100%">
          <Text textStyle="body-1">Logged in as</Text>
          <Text textStyle="body-1">@{loggedInUser}</Text>
        </Box>
      </VStack>
    </Flex>
  )
}

interface TabLabelProps {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}

const TabLabel = ({
  icon,
  children,
}: PropsWithChildren<TabLabelProps>): JSX.Element => {
  return (
    <HStack spacing="1.5rem" align="left" w="100%">
      <Icon as={icon} fontSize="1.5rem" />
      <Text textStyle="body-1">{children}</Text>
    </HStack>
  )
}

// NOTE: This button should look like a tab item
const SidebarButton = forwardRef<ButtonProps, "button">(
  (props: ButtonProps, ref): JSX.Element => {
    return (
      <Button
        border="2px solid transparent"
        w="100%"
        justifyContent="flex-start"
        variant="clear"
        py="1rem"
        // NOTE: The tabs above have 1rem spacing and a 2px divider
        // This is to ensure vertical alignment
        px="calc(1rem + 2px)"
        iconSpacing="1.5rem"
        borderRadius={0}
        h="fit-content"
        color="text.link.disabled"
        _focus={{
          borderColor: "border.action.default",
        }}
        _selected={{
          textColor: "text.link.default",
        }}
        _hover={{
          textColor: "text.link.hover",
        }}
        _active={{
          bg: "background.action.infoInverse",
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
