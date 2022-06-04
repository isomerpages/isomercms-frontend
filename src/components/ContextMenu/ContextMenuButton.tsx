import {
  Icon,
  MenuButton,
  MenuProps,
  useToken,
  forwardRef,
  MenuButtonProps,
} from "@chakra-ui/react"
import { IconButton, Menu } from "@opengovsg/design-system-react"
import { BiDotsVerticalRounded } from "react-icons/bi"

type ContextMenuButtonProps = MenuProps & { buttonProps?: MenuButtonProps }

// ContextMenuButton is a wrapper over chakra's menu/menubutton specialized to isomer's context (eg: icon)
// eslint-disable-next-line import/prefer-default-export
export const ContextMenuButton = forwardRef<ContextMenuButtonProps, "button">(
  (
    { children, buttonProps, ...props }: ContextMenuButtonProps,
    ref
  ): JSX.Element => {
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
          minH="2.5rem"
          minW="2.5rem"
          icon={
            <Icon
              as={BiDotsVerticalRounded}
              fill={tokenColour}
              fontSize="1.25rem"
            />
          }
          variant="clear"
          ref={ref}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...buttonProps}
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
)
