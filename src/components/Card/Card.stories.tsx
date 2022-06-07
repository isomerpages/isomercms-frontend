import { Icon, Text, useToast, Box } from "@chakra-ui/react"
import { ComponentMeta, Story } from "@storybook/react"
import { ContextMenu } from "components/ContextMenu"
import { BiFolder } from "react-icons/bi"

import { CardBody, Card, CardFooter } from "./Card"

const cardMeta = {
  title: "Components/Card",
  component: Card,
} as ComponentMeta<typeof Card>

interface TemplateArgs {
  text: string
}

const SingleCardTemplate: Story<TemplateArgs> = ({ text }: TemplateArgs) => {
  const toast = useToast()

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Card
      onClick={() =>
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
      variant="single"
    >
      <CardBody>
        <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
        <Text textStyle="body-1" color="text.label">
          {text}
        </Text>
      </CardBody>
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item>Something</ContextMenu.Item>
        </ContextMenu.List>
      </ContextMenu>
    </Card>
  )
}

interface MultiCardTemplateArgs extends TemplateArgs {
  caption: string
}
const MultiCardTemplate: Story<MultiCardTemplateArgs> = ({
  text,
  caption,
}: MultiCardTemplateArgs) => {
  const toast = useToast()

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box position="relative">
      <Card
        onClick={() =>
          toast({
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }
        variant="multi"
      >
        <CardBody>
          <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          <Text textStyle="body-1" color="text.label">
            {text}
          </Text>
        </CardBody>
        <CardFooter textAlign="left" ml="2.5rem">
          <Text textStyle="caption-2" color="text.helper">
            {caption}
          </Text>
        </CardFooter>
      </Card>
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item>Something</ContextMenu.Item>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}

export const SingleCard = SingleCardTemplate.bind({})
SingleCard.args = {
  text: "Folder 1",
}

export const MultiCard = MultiCardTemplate.bind({})
MultiCard.args = {
  text: "Folder 2",
  caption: "something",
}

export default cardMeta
