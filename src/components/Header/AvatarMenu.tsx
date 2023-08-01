import {
  Avatar,
  Box,
  Icon,
  MenuDivider,
  MenuButtonProps,
  MenuListProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Menu } from "@opengovsg/design-system-react"
import { BiLogOutCircle, BiUser } from "react-icons/bi"

import { ContextMenuItem } from "components/ContextMenu/ContextMenuItem"

import useRedirectHook from "hooks/useRedirectHook"

import { extractInitials } from "utils/text"

import { ContactVerificationModal } from "./ContactModal/ContactVerificationModal"

/**
 * MenuButton styled for avatar
 * Used to wrap Avatar component
 * @preconditions Must be a child of Menu component,
 * and returned using a render prop.
 */
const AvatarMenuButton = (props: MenuButtonProps): JSX.Element => {
  return (
    <Menu.Button
      variant="clear"
      px="0"
      iconSpacing="0.5rem"
      _focus={{}}
      {...props}
    />
  )
}

const AvatarMenuDivider = (): JSX.Element => {
  return <MenuDivider aria-hidden borderColor="border.divider.alt" />
}

export interface AvatarMenuProps {
  /** Name to display in the username section of the menu */
  name?: string
  menuListProps?: MenuListProps
}

export const AvatarMenu = ({
  name,
  menuListProps,
}: AvatarMenuProps): JSX.Element => {
  const {
    isOpen: isVerificationModalOpen,
    onClose: onVerificationModalClose,
    onOpen: onVerificationModalOpen,
  } = useDisclosure()
  const { setRedirectToLogout } = useRedirectHook()

  return (
    <Menu autoSelect={false} matchWidth={false}>
      {({ isOpen }) => (
        <>
          <AvatarMenuButton>
            <Avatar
              size="sm"
              name={name ? extractInitials(name) : ""}
              background="primary.500"
              textColor="white"
              boxShadow={
                isOpen
                  ? `0 0 0 4px var(--chakra-colors-primary-300)`
                  : undefined
              }
            />
          </AvatarMenuButton>
          <Menu.List
            role="menu"
            marginTop="0.375rem"
            zIndex="sticky"
            {...menuListProps}
          >
            <Box
              display="flex"
              alignItems="center"
              py="0.5rem"
              px="1rem"
              w="100%"
            >
              <Icon as={BiUser} fontSize="1.25rem" color="icon.alt" />
              <Text pl="0.5rem" noOfLines={1}>
                {name}
              </Text>
            </Box>
            <AvatarMenuDivider />
            <ContextMenuItem
              justifyContent="start"
              onClick={onVerificationModalOpen}
            >
              Emergency Contact
            </ContextMenuItem>
            <AvatarMenuDivider />
            <ContextMenuItem
              justifyContent="start"
              onClick={setRedirectToLogout}
            >
              <Icon as={BiLogOutCircle} fontSize="1.25rem" color="icon.alt" />
              <Text pl="0.5rem" noOfLines={1}>
                Log out
              </Text>
            </ContextMenuItem>
          </Menu.List>
          <ContactVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={onVerificationModalClose}
          />
        </>
      )}
    </Menu>
  )
}
