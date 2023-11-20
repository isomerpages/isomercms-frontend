import {
  Divider,
  HStack,
  Icon,
  MenuButtonProps,
  MenuListProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { Button, Menu } from "@opengovsg/design-system-react"
import { Editor } from "@tiptap/react"
import {
  BiBold,
  BiChevronDown,
  BiChevronUp,
  BiCodeAlt,
  BiFile,
  BiImageAdd,
  BiItalic,
  BiLink,
  BiListOl,
  BiListUl,
  BiMinus,
  BiRedo,
  BiStrikethrough,
  BiTable,
  BiUnderline,
  BiUndo,
} from "react-icons/bi"
import { IconType } from "react-icons/lib"

import { useEditorModal } from "contexts/EditorModalContext"

import { MenuItem } from "./MenuItem"

interface MenuBarItem {
  type: "item"
  title: string
  icon?: IconType
  textStyle?: string
  useSecondaryColor?: boolean
  leftItem?: JSX.Element
  action: () => void
  isActive?: () => boolean
}

interface MenuBarDivider {
  type: "divider"
}

interface MenuBarVeritcalList {
  type: "vertical-list"
  buttonWidth: MenuButtonProps["width"]
  menuWidth: MenuListProps["width"]
  defaultTitle: string
  items: MenuBarItem[]
}

interface MenuBarHorizontalList {
  type: "horizontal-list"
  label: string
  defaultIcon: IconType
  items: MenuBarItem[]
}

type MenuBarEntry =
  | MenuBarDivider
  | MenuBarVeritcalList
  | MenuBarHorizontalList
  | MenuBarItem

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const { showModal } = useEditorModal()

  const items: MenuBarEntry[] = [
    {
      type: "vertical-list",
      buttonWidth: "9rem",
      menuWidth: "19rem",
      defaultTitle: "Heading 1",
      items: [
        {
          type: "item",
          title: "Title",
          textStyle: "h1",
          useSecondaryColor: true,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
          type: "item",
          title: "Heading 1",
          textStyle: "h2",
          useSecondaryColor: true,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
          type: "item",
          title: "Heading 2",
          textStyle: "h3",
          useSecondaryColor: true,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive("heading", { level: 3 }),
        },
        {
          type: "item",
          title: "Heading 3",
          textStyle: "h4",
          useSecondaryColor: true,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: () => editor.isActive("heading", { level: 4 }),
        },
        {
          type: "item",
          title: "Quote block",
          textStyle: "body-1",
          useSecondaryColor: true,
          leftItem: (
            <Divider
              orientation="vertical"
              border="1px solid"
              borderColor="chakra-body-text"
              h="1.625rem"
              mr="0.75rem"
            />
          ),
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive("blockquote"),
        },
        {
          type: "item",
          title: "Paragraph",
          textStyle: "body-1",
          action: () =>
            editor.chain().focus().clearNodes().unsetAllMarks().run(),
          isActive: () => editor.isActive("paragraph"),
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "item",
      icon: BiBold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      type: "item",
      icon: BiItalic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      type: "item",
      icon: BiUnderline,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      type: "item",
      icon: BiStrikethrough,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },

    {
      type: "divider",
    },
    {
      type: "horizontal-list",
      label: "Lists",
      defaultIcon: BiListOl,
      items: [
        {
          type: "item",
          icon: BiListOl,
          title: "Ordered List",
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive("orderedList"),
        },

        {
          type: "item",
          icon: BiListUl,
          title: "Bullet List",
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive("bulletList"),
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "item",
      icon: BiLink,
      title: "Add link",
      action: () => showModal("hyperlink"),
    },
    {
      type: "item",
      icon: BiImageAdd,
      title: "Add image",
      action: () => showModal("images"),
    },
    {
      type: "item",
      icon: BiFile,
      title: "Add file",
      action: () => showModal("files"),
    },
    {
      type: "item",
      icon: BiCodeAlt,
      title: "Insert embed",
      action: () => showModal("embed"),
    },
    {
      type: "divider",
    },
    {
      type: "item",
      icon: BiTable,
      title: "Add table",
      action: () =>
        editor
          .chain()
          .focus()
          // NOTE: Default to smallest multi table
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      type: "item",
      icon: BiMinus,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      type: "item",
      icon: BiUndo,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      type: "item",
      icon: BiRedo,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ]

  return (
    <HStack
      bgColor="gray.50"
      flex="0 0 auto"
      flexWrap="wrap"
      p="0.25rem"
      borderBottom="1px solid"
      borderColor="base.divider.strong"
      borderTopRadius="0.25rem"
      spacing="0.125rem"
    >
      {items.map((item) => (
        <>
          {item.type === "divider" && (
            <Divider
              orientation="vertical"
              border="px solid"
              borderColor="base.divider.strong"
              h="1.25rem"
            />
          )}

          {item.type === "vertical-list" && (
            <Menu>
              {({ isOpen }) => {
                const activeItem = item.items.find(
                  (subItem) => subItem.isActive && subItem.isActive()
                )

                return (
                  <>
                    <Menu.Button
                      variant="clear"
                      colorScheme="grey"
                      isOpen={isOpen}
                      size="lg"
                      p="0.75rem"
                      w={item.buttonWidth}
                    >
                      {activeItem?.title || item.defaultTitle}
                    </Menu.Button>

                    <Menu.List w={item.menuWidth}>
                      {item.items.map((subItem) => (
                        <Menu.Item onClick={subItem.action}>
                          {subItem.leftItem}
                          {subItem.title && !subItem.icon && (
                            <Text
                              textStyle={subItem.textStyle}
                              fontWeight={
                                subItem.textStyle !== "body-1" ? 400 : undefined
                              }
                              color="chakra-body-text"
                            >
                              {subItem.title}
                            </Text>
                          )}
                          {subItem.icon && (
                            <MenuItem
                              icon={subItem.icon}
                              title={subItem.title}
                              action={subItem.action}
                              isActive={subItem.isActive}
                            />
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.List>
                  </>
                )
              }}
            </Menu>
          )}

          {item.type === "horizontal-list" && (
            <Popover placement="bottom">
              {({ isOpen }) => (
                <>
                  <PopoverTrigger>
                    <HStack>
                      <Button
                        _hover={{ bg: "gray.100" }}
                        _active={{ bg: "gray.200" }}
                        bgColor="transparent"
                        border="none"
                        h="1.75rem"
                        px="0.5rem"
                        py="0.25rem"
                        aria-label={item.label}
                      >
                        <HStack spacing="0.5rem">
                          <Icon
                            as={item.defaultIcon}
                            fontSize="1.25rem"
                            color="base.content.medium"
                          />
                          <Icon
                            as={isOpen ? BiChevronUp : BiChevronDown}
                            fontSize="1.25rem"
                            color="base.content.medium"
                          />
                        </HStack>
                      </Button>
                    </HStack>
                  </PopoverTrigger>
                  <PopoverContent w="7.75rem">
                    <PopoverBody>
                      <HStack>
                        {item.items.map((subItem) => (
                          <MenuItem
                            icon={subItem.icon}
                            title={subItem.title}
                            action={subItem.action}
                            isActive={subItem.isActive}
                          />
                        ))}
                      </HStack>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          )}

          {item.type === "item" && <MenuItem {...item} />}
        </>
      ))}
    </HStack>
  )
}
