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
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table"
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
import { TableVirtuoso } from "react-virtuoso"

import { BxFileArchiveSolid } from "assets"
import { extractInitials, getDateTimeFromUnixTime } from "utils"

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

const ItemName = ({ name, path }: Pick<EditedItemProps, "name" | "path">) => {
  const theme = useTheme()
  return (
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
        name={extractInitials(lastEditedBy)}
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
  const columnHelper = createColumnHelper<EditedItemProps>()

  const columns = [
    columnHelper.display({
      id: "filter",
      header: () => (
        <Th w="3rem">
          <IconButton
            aria-label="filter by file type"
            icon={<BiFilterAlt />}
            variant="link"
          />
        </Th>
      ),
      cell: (props) => getIcon(props.row.original.type),
    }),
    columnHelper.accessor((row) => `${row.name} ${row.path}`, {
      id: "itemName",
      cell: ({ row }) => (
        <ItemName name={row.original.name} path={row.original.path} />
      ),
      header: () => (
        <Th textTransform="capitalize">
          <Text textStyle="subhead-2" textColor="text.label">
            Item name
          </Text>
        </Th>
      ),
    }),
    columnHelper.accessor(
      (row) => `${row.lastEditedBy} ${row.lastEditedTime}`,
      {
        id: "lastEdited",
        header: () => (
          <Th textTransform="capitalize" w="12.5rem">
            <HStack spacing="0.25rem">
              <Text textStyle="subhead-2" textColor="text.label">
                Last edited
              </Text>
              <IconButton
                icon={<BiSort fontSize="1rem" />}
                aria-label="sort by file type"
                variant="link"
              />
            </HStack>
          </Th>
        ),
        cell: ({ row }) => (
          <LastEditedMeta
            lastEditedBy={row.original.lastEditedBy}
            lastEditedTime={row.original.lastEditedTime}
          />
        ),
      }
    ),
    columnHelper.display({
      id: "actions",
      header: () => <Th w="10rem" />,
      cell: ({ row }) => (
        <HStack spacing="0.25rem">
          <Link href={row.original.url}>
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
      ),
    }),
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <VStack spacing="1rem" mt="1rem">
      <Flex w="100%">
        <Box>
          <Text textStyle="subhead-1" textColor="text.body">
            <b>{items.length}</b> item(s) for review
          </Text>
          <Text textStyle="caption-2" textColor="text.placeholder">
            Item(s) below have been identified to have changes
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
      <Box w="100%" borderWidth="1px" borderRadius="8px" borderColor="gray.100">
        <TableVirtuoso
          style={{ height: 400, borderRadius: "8px" }}
          data={items}
          totalCount={items.length}
          components={{
            Table,
            TableBody: Tbody,
            TableRow: Tr,
            TableHead: (props) => <Thead {...props} bg="neutral.100" />,
          }}
          fixedHeaderContent={() => (
            <Tr>
              {table
                .getFlatHeaders()
                .map((header) =>
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
            </Tr>
          )}
          itemContent={(index) => {
            const row: Row<EditedItemProps> = table.getRowModel().rows[index]
            return row
              .getVisibleCells()
              .map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))
          }}
        />
      </Box>
    </VStack>
  )
}
