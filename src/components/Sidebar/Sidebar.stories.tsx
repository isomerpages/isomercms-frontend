import { Box, Divider, Icon, Text, HStack } from "@chakra-ui/react"
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Route } from "react-router-dom"

import { Sidebar } from "./Sidebar"

const SidebarMeta = {
  title: "Components/Sidebar",
  component: Sidebar,
}

const Template: ComponentStory<typeof Sidebar> = () => <Sidebar />

export const Default = Template.bind({})
export default SidebarMeta
