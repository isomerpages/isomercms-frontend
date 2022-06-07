import {
  ButtonGroup,
  IconButton,
  Icon,
  Menu as ChakraMenu,
  MenuButton,
  Text,
  MenuList,
} from "@chakra-ui/react"
import { Button, Menu } from "@opengovsg/design-system-react"
import { useState } from "react"
import {
  BiChevronDown,
  BiChevronUp,
  BiFileBlank,
  BiFolder,
} from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

export const MenuDropdownButton = (): JSX.Element => {
  const { url } = useRouteMatch()
  const [isCreatePage, setIsCreatePage] = useState(false)

  return (
    <ChakraMenu>
      {({ isOpen }) => (
        <ButtonGroup isAttached variant="outline">
          {/* NOTE: This is to avoid the 2 joined buttons both having 1px padding, 
        which results in a larger border at the attached area. */}
          <Button
            borderRight="0px"
            borderRightRadius={0}
            as={RouterLink}
            to={isCreatePage ? `${url}/createPage` : `${url}/createDirectory`}
          >
            Create {isCreatePage ? "page" : "folder"}
          </Button>
          <MenuButton
            as={IconButton}
            borderLeftRadius={0}
            aria-label="Select options"
            icon={
              <Icon
                as={isOpen ? BiChevronUp : BiChevronDown}
                fontSize="1rem"
                fill="icon.default"
              />
            }
          />
          <MenuList>
            <Menu.Item
              icon={<BiFileBlank fontSize="1.25rem" fill="icon.alt" />}
              onClick={() => setIsCreatePage(true)}
            >
              <Text textStyle="body-1" fill="text.body">
                Create Page
              </Text>
            </Menu.Item>
            <Menu.Item
              icon={<BiFolder fontSize="1.25rem" fill="icon.alt" />}
              onClick={() => setIsCreatePage(false)}
            >
              <Text textStyle="body-1" fill="text.body">
                Create Folder
              </Text>
            </Menu.Item>
          </MenuList>
        </ButtonGroup>
      )}
    </ChakraMenu>
  )
}
