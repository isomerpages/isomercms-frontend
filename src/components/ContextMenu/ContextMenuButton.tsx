import { Icon, MenuButton, forwardRef, MenuButtonProps } from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { BiDotsVerticalRounded } from "react-icons/bi"

// ContextMenuButton is a wrapper over chakra's menu/menubutton specialized to isomer's context (eg: icon)
// eslint-disable-next-line import/prefer-default-export
export const ContextMenuButton = forwardRef<MenuButtonProps, "button">(
  (props: MenuButtonProps, ref): JSX.Element => {
    return (
      <MenuButton
        position="absolute"
        bottom="1rem"
        right="2rem"
        as={IconButton}
        aria-label="Context Menu"
        icon={
          <Icon
            as={BiDotsVerticalRounded}
            fill="icon.default"
            fontSize="1.25rem"
          />
        }
        variant="clear"
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    )
  }
)
