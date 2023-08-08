import { Box, Center, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

import { HomepageStartEditingImage } from "assets"

type SidebarHeaderProps = Pick<EditableSidebarProps, "title">
const SidebarHeader = ({ title }: SidebarHeaderProps) => {
  return (
    <Flex pos="sticky" alignContent="center">
      <Text textStyle="subhead-3" color="base.content.brand">
        {title}
      </Text>
    </Flex>
  )
}

const EmptySideBarBody = () => {
  return (
    <VStack spacing="0.5rem" alignItems="flex-start">
      <Heading as="h5">Customise Sections</Heading>
      <Text textStyle="body-2">Drag and drop sections to rearrange them</Text>
      <Box>
        <Center>
          <HomepageStartEditingImage />
          <Text> Sections you add will appear here</Text>
          <Text textStyle="caption-2">
            Add informative content to your website from images to text by
            clicking “Add section” below
          </Text>
        </Center>
      </Box>
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
    <Flex flexDir="column" px="1.5rem" pt="1.5rem">
      <SidebarHeader title={title} />
      {children ? <div /> : <EmptySideBarBody />}
    </Flex>
  )
}
