import {
  ButtonGroup,
  IconButton,
  Icon,
  Menu as ChakraMenu,
  forwardRef,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { ButtonProps } from "@opengovsg/design-system-react"
import { ContextMenu } from "components/ContextMenu"
import _ from "lodash"
import { BiChevronDown, BiChevronUp } from "react-icons/bi"

interface MenuDropdownButtonProps extends ButtonProps {
  mainButtonText: string
}

// NOTE: For icon buttons where the bg is clear, icon.default won't clash with the background
// However, for solid background, return icon.inverse so that the chevron is clear.
const computeIconFill = (variant: ButtonProps["variant"]): string => {
  if (variant === "solid") {
    return "icon.inverse"
  }

  return "icon.default"
}

/**
 * The button props and mainButtonText props are passed to the main button.
 * The children props are passed to the context menu and should be a list of
 * MenuDropdownItem components.
 */
export const MenuDropdownButton = forwardRef<MenuDropdownButtonProps, "button">(
  (
    props: Omit<MenuDropdownButtonProps, "borderRight" | "borderRightRadius">,
    ref
  ): JSX.Element => {
    const buttonVariant = props.variant ?? "outline"

    return (
      <ChakraMenu>
        {({ isOpen }) => (
          <ButtonGroup isAttached variant={buttonVariant}>
            {/* NOTE: This is to avoid the 2 joined buttons both having 1px
            padding, which results in a larger border at the attached area. */}
            <Button
              borderRight="0px"
              borderRightRadius={0}
              ref={ref}
              {..._.omit(props, "children")}
            >
              {props.mainButtonText}
            </Button>
            <ContextMenu
              placement="bottom-end"
              /** This positions it (x, y) units away relative from the base
               * position to prevent weird gap between the dropdown menu and
               * button
               */
              offset={[0, 0]}
            >
              <ContextMenu.Button
                position="inherit"
                as={IconButton}
                borderLeftRadius={0}
                aria-label="Select options"
                variant={buttonVariant}
                colorScheme={props.colorScheme}
                icon={
                  <Icon
                    as={isOpen ? BiChevronUp : BiChevronDown}
                    fontSize="1rem"
                    fill={computeIconFill(buttonVariant)}
                  />
                }
              />
              <ContextMenu.List>{props.children}</ContextMenu.List>
            </ContextMenu>
          </ButtonGroup>
        )}
      </ChakraMenu>
    )
  }
)

export const MenuDropdownItem = ContextMenu.Item
