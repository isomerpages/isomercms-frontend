import { Menu as ChakraMenu, MenuListProps, MenuProps } from "@chakra-ui/react"
import { Menu } from "@opengovsg/design-system-react"

import { ContextMenuButton } from "./ContextMenuButton"
import { ContextMenuItem } from "./ContextMenuItem"

// NOTE: Need to do this to be able to set properties
export const ContextMenu = (props: MenuProps): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ChakraMenu {...props} placement="bottom-start" />
)

const ContextMenuList = (props: MenuListProps): JSX.Element => {
  return (
    <Menu.List
      zIndex={3}
      color="text.body"
      boxShadow="0px 0px 10px rgba(191, 191, 191, 0.5)"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  )
}
ContextMenu.Item = ContextMenuItem
ContextMenu.Button = ContextMenuButton
ContextMenu.List = ContextMenuList
