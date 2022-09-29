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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import {
  Searchbar,
  IconButton,
  useSearchbar,
  Button,
} from "@opengovsg/design-system-react"
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import _ from "lodash"
import { useState } from "react"
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
  BiChevronDown,
  BiCompass,
  BiCheck,
} from "react-icons/bi"
import { TableVirtuoso } from "react-virtuoso"

import { BxFileArchiveSolid } from "assets"
import { extractInitials, getDateTimeFromUnixTime } from "utils"

const ICON_STYLE_PROPS = {
  ml: "0.75rem",
  fontSize: "1.25rem",
  fill: "icon.alt",
}

const getIcon = (iconTypes: EditedItemProps["type"]): JSX.Element => {
  const iconType = iconTypes[0]
  switch (iconType) {
    case "nav": {
      return <Icon {...ICON_STYLE_PROPS} as={BiWorld} />
    }
    case "file": {
      return <Icon {...ICON_STYLE_PROPS} as={BxFileArchiveSolid} />
    }
    case "setting": {
      return <Icon {...ICON_STYLE_PROPS} as={BiCog} />
    }
    case "page": {
      return <Icon {...ICON_STYLE_PROPS} as={BiFileBlank} />
    }
    case "image": {
      return <Icon {...ICON_STYLE_PROPS} as={BiImage} />
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
  const theme = useTheme()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = [
    columnHelper.accessor((row) => row.type, {
      id: "type",
      header: ({ column }) => (
        <Menu>
          <MenuButton
            as={IconButton}
            variant="clear"
            icon={<BiFilterAlt />}
            fontSize="1.25rem"
            aria-label="sort by file type"
          />
          <MenuList>
            <MenuItem
              minW="10rem"
              icon={
                // NOTE: Using an Icon component to hook into design system results in a
                // slightly off center icon, which is why using the base component itself
                // from react-icons + using the theme is preferred.
                <BiFileBlank fontSize="1rem" fill={theme.colors.icon.alt} />
              }
              iconSpacing="0.5rem"
              onClick={() => {
                column.setFilterValue(["page", "image", "file"])
              }}
            >
              <Flex align="center">
                <Text textStyle="subhead-2" textColor="text.body">
                  Pages
                </Text>
                <Spacer />
                {_.isEqual(column.getFilterValue(), [
                  "page",
                  "image",
                  "file",
                ]) && <Icon as={BiCheck} fill="icon.default" fontSize="1rem" />}
              </Flex>
            </MenuItem>
            <MenuItem
              minW="10rem"
              iconSpacing="0.5rem"
              icon={<BiCog fontSize="1rem" fill={theme.colors.icon.alt} />}
              onClick={() => {
                column.setFilterValue(["setting"])
              }}
            >
              <Flex align="center">
                <Text textStyle="subhead-2" textColor="text.body">
                  Settings
                </Text>
                <Spacer />
                {_.isEqual(column.getFilterValue(), ["setting"]) && (
                  <Icon as={BiCheck} fill="icon.default" fontSize="1rem" />
                )}
              </Flex>
            </MenuItem>
            <MenuItem
              minW="10rem"
              icon={<BiCompass fontSize="1rem" fill={theme.colors.icon.alt} />}
              iconSpacing="0.5rem"
              onClick={() => {
                column.setFilterValue(["nav"])
              }}
            >
              <Flex align="center">
                <Text textStyle="subhead-2" textColor="text.body">
                  Navigation
                </Text>
                <Spacer />
                {_.isEqual(column.getFilterValue(), ["nav"]) && (
                  <Icon as={BiCheck} fill="icon.default" fontSize="1rem" />
                )}
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      ),
      cell: (props) => getIcon(props.row.original.type),
      filterFn: "arrIncludesSome",
    }),
    columnHelper.accessor((row) => `${row.name} ${row.path}`, {
      id: "itemName",
      sortingFn: "textCaseSensitive",
      cell: ({ row }) => (
        <ItemName name={row.original.name} path={row.original.path} />
      ),
      // NOTE: This is case insensitive and will search through both name + path
      // This is due to the accessor returning a composite string.
      // Do note that the path will be joined using a , so for composite search paths
      // like: /some/folder, the correct search term would be some,folder.
      filterFn: "includesString",
      header: ({ column }) => (
        <Button
          ml="-0.25rem"
          variant="link"
          _hover={{
            textDecoration: "none",
          }}
          onClick={column.getToggleSortingHandler()}
        >
          <HStack w="28rem" spacing="0.5rem">
            <Text
              textAlign="left"
              textTransform="capitalize"
              textStyle="subhead-2"
              textColor="text.label"
            >
              Item name
            </Text>
            <BiChevronDown fontSize="1rem" />
          </HStack>
        </Button>
      ),
    }),
    columnHelper.accessor((row) => new Date(row.lastEditedTime), {
      id: "lastEdited",
      sortingFn: "datetime",
      header: ({ column }) => (
        <Button
          ml="-0.25rem"
          variant="link"
          _hover={{
            textDecoration: "none",
          }}
          onClick={column.getToggleSortingHandler()}
        >
          <HStack w="9rem" textTransform="capitalize" spacing="0.5rem">
            <Text textStyle="subhead-2" textColor="text.label">
              Last edited
            </Text>
            <BiSort fontSize="1rem" />
          </HStack>
        </Button>
      ),
      cell: ({ row }) => (
        <LastEditedMeta
          lastEditedBy={row.original.lastEditedBy}
          lastEditedTime={row.original.lastEditedTime}
        />
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => null,
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
    state: {
      columnFilters,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
          onSearch={table.getColumn("itemName").setFilterValue}
          onBlur={handleCollapse}
        />
      </Flex>
      <Box w="100%" borderWidth="1px" borderRadius="8px" borderColor="gray.100">
        <TableVirtuoso
          style={{
            height: "25rem",
            borderRadius: "8px",
          }}
          // NOTE: Pass in only the list of filtered rows.
          // This is to ensure that no indexing error occurs
          // Eg: we filter so that only 1 item remains but render index is >1
          data={table.getFilteredRowModel().rows}
          totalCount={items.length}
          components={{
            Table,
            TableBody: Tbody,
            TableRow: Tr,
            TableHead: (props) => <Thead {...props} bg="neutral.100" />,
          }}
          fixedHeaderContent={() =>
            table
              .getFlatHeaders()
              .map((header) => (
                <Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))
          }
          itemContent={(index) => {
            const row: Row<EditedItemProps> = table.getRowModel().rows[index]
            // NOTE: This is guaranteed to exist because the table will filter
            // so that the index we're referencing is within the filtered items.
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
