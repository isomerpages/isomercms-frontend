import {
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { BiFolder } from "react-icons/bi"

import { ContextMenu } from "components/ContextMenu"

import { HomepageStartEditingImage } from "assets"

type SidebarHeaderProps = Pick<EditableSidebarProps, "title">
const SidebarHeader = ({ title }: SidebarHeaderProps) => {
  return (
    <Flex
      w="100%"
      bg="base.canvas.default"
      pos="sticky"
      justify="center"
      py="1rem"
    >
      <Text textStyle="subhead-3" color="base.content.brand">
        {title}
      </Text>
    </Flex>
  )
}

const EmptySideBarBody = () => {
  return (
    <VStack spacing="0.5rem" alignItems="flex-start" px="1.5rem" pt="1.5rem">
      <Text textStyle="h5">Customise Sections</Text>
      <Text textStyle="body-2">Drag and drop sections to rearrange them</Text>
      <Flex
        alignItems="center"
        flexDir="column"
        p="3.75rem 1.5rem"
        justifyContent="center"
      >
        <HomepageStartEditingImage />
        <Text> Sections you add will appear here</Text>
        <Text
          textStyle="caption-2"
          textColor="base.content.medium"
          textAlign="center"
        >
          Add informative content to your website from images to text by
          clicking “Add section” below
        </Text>
      </Flex>
    </VStack>
  )
}

export interface EditableSidebarProps {
  title: string
}
export const EditableSidebar = ({
  title,
  children,
}: PropsWithChildren<EditableSidebarProps>) => {
  return (
    <Flex flexDir="column" bg="base.canvas.alt">
      <SidebarHeader title={title} />
      {children ? <>{children} </> : <EmptySideBarBody />}
    </Flex>
  )
}
