import {
  Avatar,
  Text,
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Icon,
  Spacer,
  Flex,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  useTheme,
} from "@chakra-ui/react"
import {
  Searchbar,
  IconButton,
  useSearchbar,
} from "@opengovsg/design-system-react"
import {
  BiGitCompare,
  BiWorld,
  BiFileBlank,
  BiImage,
  BiCog,
  BiShow,
  BiSort,
  BiFilterAlt,
  BiChevronRight,
} from "react-icons/bi"

import { BxFileArchiveSolid } from "assets"

interface DisplayedDateTime {
  date: string
  time: string
}

const getDateTimeFromUnixTime = (unixTime: number): DisplayedDateTime => {
  const date = new Date(unixTime)
  return {
    date: date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-GB", {
      timeStyle: "short",
    }),
  }
}

const getIcon = (iconTypes: EditedItemProps["type"]): JSX.Element => {
  const iconType = iconTypes[0]
  switch (iconType) {
    case "nav": {
      return (
        <Icon ml="0.75rem" fontSize="1.25rem" fill="icon.alt" as={BiWorld} />
      )
    }
    case "file": {
      return (
        <Icon
          ml="0.75rem"
          fontSize="1.25rem"
          fill="icon.alt"
          as={BxFileArchiveSolid}
        />
      )
    }
    case "setting": {
      return <Icon ml="0.75rem" fontSize="1.25rem" fill="icon.alt" as={BiCog} />
    }
    case "page": {
      return (
        <Icon
          ml="0.75rem"
          fontSize="1.25rem"
          fill="icon.alt"
          as={BiFileBlank}
        />
      )
    }
    case "image": {
      return (
        <Icon ml="0.75rem" fontSize="1.25rem" fill="icon.alt" as={BiImage} />
      )
    }
    default: {
      // NOTE: This is done to ensure exhaustive type matching
      const error: never = iconType
      throw new Error(`Unmatched fileType: ${error}`)
    }
  }
}

type FileType = "page" | "nav" | "setting" | "file" | "image"

export interface EditedItemProps {
  type: FileType[]
  name: string
  path: string[]
  url: string
  lastEditedBy: string
  lastEditedTime: number
}

const EditedItem = ({
  type,
  name,
  path,
  url,
  lastEditedBy,
  lastEditedTime,
}: EditedItemProps): JSX.Element => {
  const theme = useTheme()
  return (
    <Tr overflowX="auto">
      <Td>{getIcon(type)}</Td>
      <Td>
        <VStack align="flex-start">
          <Text textStyle="subhead-2" textColor="text.label" noOfLines={1}>
            {name}
          </Text>
          <Breadcrumb
            as={Text}
            textOverflow="ellipsis"
            overflowX="auto"
            spacing="2px"
            separator={<BiChevronRight color={theme.colors.text.helper} />}
          >
            {path.map((item) => {
              return (
                <BreadcrumbItem>
                  <Text textStyle="caption-2" textColor="text.helper">
                    {item}
                  </Text>
                </BreadcrumbItem>
              )
            })}
          </Breadcrumb>
        </VStack>
      </Td>
      <Td>
        <LastEditedMeta
          lastEditedBy={lastEditedBy}
          lastEditedTime={lastEditedTime}
        />
      </Td>
      <Td>
        <HStack spacing="0.25rem">
          <Link href={url}>
            <IconButton
              icon={<BiGitCompare />}
              aria-label="view file on staging"
              variant="link"
            />
          </Link>
          <IconButton
            icon={<BiShow />}
            aria-label="view file changes"
            variant="link"
          />
        </HStack>
      </Td>
    </Tr>
  )
}

type LastEditedMetaProps = Pick<
  EditedItemProps,
  "lastEditedBy" | "lastEditedTime"
>
const LastEditedMeta = ({
  lastEditedBy,
  lastEditedTime,
}: LastEditedMetaProps): JSX.Element => {
  const { date, time } = getDateTimeFromUnixTime(lastEditedTime)
  return (
    <HStack>
      <Avatar
        bg="primary.100"
        name={lastEditedBy.slice(0, 2).split("").join(" ")}
        textStyle="caption-2"
        textColor="primary.400"
        size="sm"
      />
      <VStack align="flex-start">
        <Text textStyle="caption-2" textColor="text.helper">
          {date}
        </Text>
        <Text textStyle="caption-2" textColor="text.helper">
          {time}
        </Text>
      </VStack>
    </HStack>
  )
}

export interface RequestOverviewProps {
  items: EditedItemProps[]
}

export const RequestOverview = ({
  items,
}: RequestOverviewProps): JSX.Element => {
  const {
    isExpanded,
    inputRef,
    handleExpansion,
    handleCollapse,
  } = useSearchbar({})

  return (
    <VStack spacing="1rem" mt="1rem">
      <Flex w="100%">
        <Box>
          <Text textStyle="subhead-1" textColor="text.body">
            <b>{items.length}</b> item(s) for review
          </Text>
          <Text textStyle="caption-2" textColor="text.placeholder">
            Items below have been identified to have changes
          </Text>
        </Box>
        <Spacer />
        <Searchbar
          ref={inputRef}
          onSearchIconClick={handleExpansion}
          isExpanded={isExpanded}
          onSearch={() => {
            console.log("hi")
          }}
          onBlur={handleCollapse}
        />
      </Flex>
      <Box borderWidth="1px" borderRadius="8px" w="100%" borderColor="gray.100">
        <Table w="100%">
          <Thead>
            <Tr>
              <Th w="3rem">
                <IconButton
                  aria-label="sort by file type"
                  icon={<BiFilterAlt />}
                  variant="link"
                />
              </Th>
              <Th textTransform="capitalize">
                <Text textStyle="subhead-2" textColor="text.label">
                  Item name
                </Text>
              </Th>
              <Th textTransform="capitalize" w="12.5rem">
                <HStack spacing="0.25rem">
                  <Text textStyle="subhead-2" textColor="text.label">
                    Last edited
                  </Text>
                  <IconButton
                    icon={<BiSort fontSize="1rem" />}
                    aria-label="view file changes"
                    variant="link"
                  />
                </HStack>
              </Th>
              <Th w="10rem" />
            </Tr>
          </Thead>
          <Tbody>
            {items.map((props) => (
              <EditedItem {...props} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  )
}
