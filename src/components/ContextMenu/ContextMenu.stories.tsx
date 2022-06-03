import "@opengovsg/design-system-react/build/fonts/inter.css"
import { Box, Divider, Flex, Icon, Text } from "@chakra-ui/react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"

import { ContextMenuButton } from "./ContextMenuButton"
import { ContextMenuItem } from "./ContextMenuItem"

const contextMenuMeta = {
  title: "Components/Context Menu",
  component: ContextMenuButton,
} as ComponentMeta<typeof ContextMenuButton>

const BaseComponent = (args: TemplateArgs) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ContextMenuButton {...args}>
      <ContextMenuItem icon={<BiEditAlt />}>
        <Text textStyle="body-1">Edit page</Text>
      </ContextMenuItem>
      <ContextMenuItem icon={<BiWrench />}>Page settings</ContextMenuItem>
      <ContextMenuItem icon={<BiFolder />}>
        <Flex justify="space-between" alignItems="center">
          <Text>Move to</Text>
          <Icon as={BiChevronRight} fontSize="1.25rem" />
        </Flex>
      </ContextMenuItem>
      <>
        <Divider />
        <ContextMenuItem icon={<BiTrash />}>Page settings</ContextMenuItem>
      </>
    </ContextMenuButton>
  )
}

interface TemplateArgs {
  defaultIsOpen: boolean
}

const Template: ComponentStory<typeof BaseComponent> = (args: TemplateArgs) => (
  <Box position="relative" w="100%" h="80px">
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <BaseComponent {...args} />
  </Box>
)

export const ContextMenu = Template.bind({})
export const OpenContextMenu = Template.bind({})
OpenContextMenu.args = {
  defaultIsOpen: true,
}
export default contextMenuMeta
