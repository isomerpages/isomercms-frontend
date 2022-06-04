import { Icon, Text, VStack, useToast } from "@chakra-ui/react"
import { ComponentMeta, Story } from "@storybook/react"
import { ContextMenuButton, ContextMenuItem } from "components/ContextMenu"
import { BiFolder } from "react-icons/bi"

import { CardVariant } from "theme/components/Card"

import { CardBody, CardContent } from "./Card"

const cardMeta = {
  title: "Components/Card",
  component: CardContent,
} as ComponentMeta<typeof CardContent>

interface TemplateArgs {
  text: string
  variant: CardVariant
}

const Template: Story<TemplateArgs> = ({ text, variant }: TemplateArgs) => {
  const toast = useToast()

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CardContent
      onClick={() =>
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
      variant={variant}
    >
      <CardBody>
        <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
        <Text textStyle="body-1" color="text.label">
          {text}
        </Text>
      </CardBody>
      <ContextMenuButton>
        <ContextMenuItem>Something</ContextMenuItem>
      </ContextMenuButton>
      {/* <VStack spacing="0.875rem" alignItems="flex-start">
        <Text textStyle="body-1" color="text.label">
          {text}
        </Text>
        <Text textStyle="caption-2" color="text.helper">
          03 Sep 2021/POST
        </Text>
      </VStack> */}
    </CardContent>
  )
}

export const SingleCard = Template.bind({})
SingleCard.args = {
  text: "Folder 1",
  variant: "single",
}

export default cardMeta
