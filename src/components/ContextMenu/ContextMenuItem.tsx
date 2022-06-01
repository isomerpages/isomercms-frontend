import { MenuItemProps, useToken } from "@chakra-ui/react"
import { Menu } from "@opengovsg/design-system-react"
import { cloneElement } from "react"

type ContextMenuItemProps = Omit<MenuItemProps, "iconSpacing">

// eslint-disable-next-line import/prefer-default-export
export const ContextMenuItem = ({
  icon,
  ...props
}: ContextMenuItemProps): JSX.Element => {
  const iconColour = useToken("colors", "icon.alt")
  // NOTE: This will override the component props set on icon
  const innerIcon =
    icon &&
    cloneElement(icon, {
      fontSize: "1.25rem",
      fill: iconColour,
    })

  return (
    <Menu.Item
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      iconSpacing="1rem"
      icon={innerIcon}
    />
  )
}
