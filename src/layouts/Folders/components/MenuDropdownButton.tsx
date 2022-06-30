import {
  ButtonGroup,
  IconButton,
  Icon,
  Menu as ChakraMenu,
  Text,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ContextMenu } from "components/ContextMenu"
import {
  BiChevronDown,
  BiChevronUp,
  BiFileBlank,
  BiFolder,
} from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

export const MenuDropdownButton = (): JSX.Element => {
  const { url } = useRouteMatch()

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
            to={`${url}/createPage`}
          >
            Create page
          </Button>
          <ContextMenu>
            <ContextMenu.Button
              position="inherit"
              as={IconButton}
              borderLeftRadius={0}
              aria-label="Select options"
              variant="outline"
              icon={
                <Icon
                  as={isOpen ? BiChevronUp : BiChevronDown}
                  fontSize="1rem"
                  fill="icon.default"
                />
              }
            />
            <ContextMenu.List>
              <ContextMenu.Item
                as={RouterLink}
                to={`${url}/createPage`}
                icon={<BiFileBlank fontSize="1.25rem" fill="icon.alt" />}
              >
                <Text textStyle="body-1" fill="text.body">
                  Create page
                </Text>
              </ContextMenu.Item>
              <ContextMenu.Item
                as={RouterLink}
                to={`${url}/createDirectory`}
                icon={<BiFolder fontSize="1.25rem" fill="icon.alt" />}
              >
                <Text textStyle="body-1" fill="text.body">
                  Create folder
                </Text>
              </ContextMenu.Item>
            </ContextMenu.List>
          </ContextMenu>
        </ButtonGroup>
      )}
    </ChakraMenu>
  )
}
