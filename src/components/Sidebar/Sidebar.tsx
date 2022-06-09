import {
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
} from "@chakra-ui/react"
import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"
import {
  BiBook,
  BiBuoy,
  BiCog,
  BiCubeAlt,
  BiFile,
  BiGridAlt,
  BiImage,
  BiLogOutCircle,
} from "react-icons/bi"
import { useParams, Link as RouterLink } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLastUpdated } from "hooks/useLastUpdated"
import { useLocalStorage } from "hooks/useLocalStorage"
import { useSidebarContext } from "hooks/useSidebar"

import { TabSection } from "types/sidebar"

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
  const { lastUpdated, isError, isLoading } = useLastUpdated(siteName)
  const { selectedTab, setSelectedTab } = useSidebarContext()
  const [loggedInUser] = useLocalStorage(
    LOCAL_STORAGE_KEYS.GithubId,
    "Unknown user"
  )

  return (
    <Flex bg="white" h="100vh" flexDir="column" w="15rem">
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
              {isError ? "Unable to retrieve last updated time" : lastUpdated}
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
            onClick={() => setSelectedTab("workspace")}
          >
            <TabLabel icon={BiCubeAlt}>My Workspace</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/resourceRoom`}
            isSelected={selectedTab === "resourceRoom"}
            onClick={() => setSelectedTab("resourceRoom")}
          >
            <TabLabel icon={BiGridAlt}>Resources</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/media/images/mediaDirectory/images`}
            isSelected={selectedTab === "images"}
            onClick={() => setSelectedTab("images")}
          >
            <TabLabel icon={BiImage}>Images</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/media/files/mediaDirectory/files`}
            isSelected={selectedTab === "files"}
            onClick={() => setSelectedTab("files")}
          >
            <TabLabel icon={BiFile}>Files</TabLabel>
          </Tab>
          <Tab
            as={RouterLink}
            to={`/sites/${siteName}/settings`}
            isSelected={selectedTab === "settings"}
            onClick={() => setSelectedTab("settings")}
          >
            <TabLabel icon={BiCog}>Site Settings</TabLabel>
          </Tab>
        </TabList>
      </Tabs>
      <Spacer />
      <Divider color="secondary.100" />
      <SidebarButton leftIcon={<Icon as={BiBook} fontSize="1.5rem" />}>
        <Text textStyle="body-1">Guide</Text>
      </SidebarButton>
      <SidebarButton
        leftIcon={<Icon as={BiBuoy} fontSize="1.5rem" />}
        h="fit-content"
      >
        <Text textStyle="body-1">Help</Text>
      </SidebarButton>
      <Divider color="secondary.100" />
      <VStack spacing="2rem" pt="0.5rem">
        <SidebarButton isFullWidth display="block">
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
const SidebarButton = (props: ButtonProps): JSX.Element => {
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
      {...props}
    />
  )
}
