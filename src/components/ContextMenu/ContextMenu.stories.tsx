import { Box, Divider, Icon, Text, HStack } from "@chakra-ui/react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"

import { ContextMenu } from "./ContextMenu"

const contextMenuMeta = {
  title: "Components/Context Menu",
  component: ContextMenu,
} as ComponentMeta<typeof ContextMenu>

const BaseComponent = (args: TemplateArgs) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ContextMenu {...args}>
      <ContextMenu.Button />
      <ContextMenu.List>
        <ContextMenu.Item icon={<BiEditAlt />}>
          <Text>Edit page</Text>
        </ContextMenu.Item>
        <ContextMenu.Item icon={<BiWrench />}>Page Settings</ContextMenu.Item>
        <ContextMenu.Item icon={<BiFolder />}>
          <HStack spacing="4rem" alignItems="center">
            <Text>Move to</Text>
            <Icon as={BiChevronRight} fontSize="1.25rem" />
          </HStack>
        </ContextMenu.Item>
        <>
          <Divider />
          <ContextMenu.Item icon={<BiTrash />}>Delete</ContextMenu.Item>
        </>
      </ContextMenu.List>
    </ContextMenu>
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

export const ClosedContextMenu = Template.bind({})
export const OpenContextMenu = Template.bind({})
OpenContextMenu.args = {
  defaultIsOpen: true,
}
export default contextMenuMeta
