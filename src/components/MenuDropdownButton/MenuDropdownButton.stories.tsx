import { Icon, Text } from "@chakra-ui/react"
import { ButtonProps } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"
import { BiFileBlank, BiFolder } from "react-icons/bi"

import { MenuDropdownButton, MenuDropdownItem } from "./MenuDropdownButton"

const menuDropdownButtonMeta = {
  title: "Components/Menu Dropdown Button",
  component: MenuDropdownButton,
} as ComponentMeta<typeof MenuDropdownButton>

interface MenuDropdownButtonTemplateArgs {
  mainButtonText: string
  variant?: ButtonProps["variant"]
  items: JSX.Element
}

const menuDropdownButtonTemplate: Story<MenuDropdownButtonTemplateArgs> = ({
  mainButtonText,
  variant,
  items,
}: MenuDropdownButtonTemplateArgs) => {
  return (
    <MenuDropdownButton
      mainButtonText={mainButtonText}
      variant={variant ?? "outline"}
    >
      {items}
    </MenuDropdownButton>
  )
}

export const buttonWithoutIcons = menuDropdownButtonTemplate.bind({})
buttonWithoutIcons.args = {
  mainButtonText: "Open staging",
  variant: "outline",
  items: (
    <>
      <MenuDropdownItem as="a" href="">
        <Text textStyle="body-1" fill="text.body">
          Open staging site
        </Text>
      </MenuDropdownItem>
      <MenuDropdownItem as="a" href="">
        <Text textStyle="body-1" fill="text.body">
          Visit live site
        </Text>
      </MenuDropdownItem>
    </>
  ),
}

export const buttonWithIcons = menuDropdownButtonTemplate.bind({})
buttonWithIcons.args = {
  mainButtonText: "Create page",
  variant: "outline",
  items: (
    <>
      <MenuDropdownItem
        as="a"
        href=""
        icon={<Icon as={BiFileBlank} fontSize="1.25rem" fill="icon.alt" />}
      >
        <Text textStyle="body-1" fill="text.body">
          Create page
        </Text>
      </MenuDropdownItem>
      <MenuDropdownItem
        as="a"
        href=""
        icon={<Icon as={BiFolder} fontSize="1.25rem" fill="icon.alt" />}
      >
        <Text textStyle="body-1" fill="text.body">
          Create folder
        </Text>
      </MenuDropdownItem>
    </>
  ),
}

export default menuDropdownButtonMeta
