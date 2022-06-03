import { MenuButton, MenuProps, useToken } from "@chakra-ui/react"
import { IconButton, Menu } from "@opengovsg/design-system-react"
import { BiDotsVerticalRounded } from "react-icons/bi"

// ContextMenuButton is a wrapper over chakra's menu/menubutton specialized to isomer's context (eg: icon)
// eslint-disable-next-line import/prefer-default-export
export const ContextMenuButton = ({
  children,
  ...props
}: MenuProps): JSX.Element => {
  const baseColour = useToken("colors", "text.body")
  const tokenColour = useToken("colors", "icon.default")

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Menu {...props}>
      {/* NOTE: Not using design system's menu button as the icon prop cannot be set */}
      <MenuButton
        position="absolute"
        bottom="1rem"
        right="2rem"
        as={IconButton}
        aria-label="Context Menu"
        icon={<BiDotsVerticalRounded fill={tokenColour} />}
        variant="clear"
      />
      <Menu.List
        color={baseColour}
        boxShadow="0px 0px 10px rgba(191, 191, 191, 0.5)"
      >
        {children}
      </Menu.List>
    </Menu>
  )
}
