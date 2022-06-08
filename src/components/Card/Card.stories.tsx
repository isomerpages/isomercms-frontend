import {
  Icon,
  Text,
  useToast,
  Box,
  Flex,
  chakra,
  Center,
} from "@chakra-ui/react"
import { ComponentMeta, Story } from "@storybook/react"
import { ContextMenu } from "components/ContextMenu"
import { BiFolder } from "react-icons/bi"

import { Card } from "./Card"

const cardMeta = {
  title: "Components/Card",
  component: Card,
} as ComponentMeta<typeof Card>

interface TemplateArgs {
  text: string
}

interface MultiCardTemplateArgs extends TemplateArgs {
  caption: string
}

const SingleCardWithLeftItemTemplate: Story<TemplateArgs> = ({
  text,
}: TemplateArgs) => {
  return (
    <Card>
      <Card.Layout variant="left">
        <Card.Item position="leftItem">
          <Flex h="100%" alignItems="center" justify="flex-start">
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          </Flex>
        </Card.Item>
        <Card.Body>{text}</Card.Body>
      </Card.Layout>
    </Card>
  )
}

const SingleCardWithRightItemTemplate: Story<TemplateArgs> = ({
  text,
}: TemplateArgs) => {
  return (
    <Card>
      <Card.Layout variant="right">
        <Card.Item position="rightItem">
          <Flex h="100%" alignItems="center" justify="flex-end">
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          </Flex>
        </Card.Item>
        <Card.Body>{text}</Card.Body>
      </Card.Layout>
    </Card>
  )
}

const SingleCardFullTemplate: Story<TemplateArgs> = ({
  text,
}: TemplateArgs) => {
  return (
    <Card gridAutoRows="25rem">
      <Card.Layout variant="full" verticalAlign="center">
        <Card.Item position="leftItem">
          <Flex h="100%" alignItems="center" justify="flex-start">
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          </Flex>
        </Card.Item>
        <Card.Body>{text}</Card.Body>
        <Card.Item position="rightItem">
          <ContextMenu>
            <ContextMenu.Button />
            <ContextMenu.List>
              <ContextMenu.Item>Something</ContextMenu.Item>
            </ContextMenu.List>
          </ContextMenu>
        </Card.Item>
      </Card.Layout>
    </Card>
  )
}

const MultiCardWithLeftItemTemplate: Story<MultiCardTemplateArgs> = ({
  text,
  caption,
}: MultiCardTemplateArgs) => {
  return (
    <Card>
      <Card.Layout variant="left" isMultiline>
        <Card.Item position="leftItem">
          <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
        </Card.Item>
        <Card.Item position="body">{text}</Card.Item>
        <Card.Item position="footer">
          <Flex align="center" h="100%">
            <Text textStyle="caption-2" color="GrayText">
              {caption}
            </Text>
          </Flex>
        </Card.Item>
      </Card.Layout>
    </Card>
  )
}

const MultiCardWithRightItemTemplate: Story<MultiCardTemplateArgs> = ({
  text,
  caption,
}: MultiCardTemplateArgs) => {
  return (
    <Card>
      <Card.Layout variant="right" isMultiline>
        <Card.Item position="rightItem">
          <ContextMenu>
            <ContextMenu.Button bottom="1rem" />
            <ContextMenu.List>
              <ContextMenu.Item>Something</ContextMenu.Item>
            </ContextMenu.List>
          </ContextMenu>
        </Card.Item>
        <Card.Item position="body">{text}</Card.Item>
        <Card.Item position="footer">
          <Flex align="center" h="100%">
            <Text textStyle="caption-2" color="GrayText">
              {caption}
            </Text>
          </Flex>
        </Card.Item>
      </Card.Layout>
    </Card>
  )
}

const MultiCardFullTemplate: Story<MultiCardTemplateArgs> = ({
  text,
  caption,
}: MultiCardTemplateArgs) => {
  return (
    <Card>
      <Card.Layout variant="full" isMultiline>
        <Card.Item position="leftItem">
          <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
        </Card.Item>

        <Card.Item position="rightItem">
          <ContextMenu>
            <ContextMenu.Button bottom="1rem" />
            <ContextMenu.List>
              <ContextMenu.Item>Something</ContextMenu.Item>
            </ContextMenu.List>
          </ContextMenu>
        </Card.Item>

        <Card.Item position="body">{text}</Card.Item>
        <Card.Item position="footer">
          <Flex align="center" h="100%">
            <Text textStyle="caption-2" color="GrayText">
              {caption}
            </Text>
          </Flex>
        </Card.Item>
      </Card.Layout>
    </Card>
  )
}

const MultiCardFullButtonTemplate: Story<MultiCardTemplateArgs> = ({
  text,
  caption,
}: MultiCardTemplateArgs) => {
  const toast = useToast()
  return (
    <Box position="relative">
      <Card
        as={chakra.button}
        display="block"
        w="100%"
        textAlign="left"
        onClick={() =>
          toast({
            title: "Card button clicked",
            description: "You clicked the card button wassup",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }
      >
        <Card.Layout variant="full" isMultiline>
          <Card.Item position="leftItem">
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
          </Card.Item>

          {/* NOTE: This is required to reserve a space for the item in the layout. */}
          <Card.Item position="rightItem" />

          <Card.Item position="body">
            <Text textStyle="subhead-1">{text}</Text>
          </Card.Item>
          <Card.Item position="footer">
            <Flex align="center" h="100%">
              <Text textStyle="caption-2" color="GrayText">
                {caption}
              </Text>
            </Flex>
          </Card.Item>
        </Card.Layout>
      </Card>
      <ContextMenu>
        <ContextMenu.Button
          bottom="1rem"
          onClick={() =>
            toast({
              title: "Menu button clicked",
              description: "You clicked the menu button wassup",
              status: "success",
              duration: 9000,
              isClosable: true,
            })
          }
        />
        <ContextMenu.List>
          <ContextMenu.Item
            onClick={() =>
              toast({
                title: "Menu item button clicked",
                description: "You clicked the menu item button wassup",
                status: "success",
                duration: 9000,
                isClosable: true,
              })
            }
          >
            Something
          </ContextMenu.Item>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}

export const SingleCardWithLeftItem = SingleCardWithLeftItemTemplate.bind({})
SingleCardWithLeftItem.args = {
  text: "Folder 1",
}

export const SingleCardWithRightItem = SingleCardWithRightItemTemplate.bind({})
SingleCardWithRightItem.args = {
  text: "Folder 1",
}

export const SingleCardFull = SingleCardFullTemplate.bind({})
SingleCardFull.args = {
  text: "Folder 1",
}

export const MultiCardWithLeftItem = MultiCardWithLeftItemTemplate.bind({})
MultiCardWithLeftItem.args = {
  text: "Folder 1",
  caption: "Some caption",
}

export const MultiCardWithRightItem = MultiCardWithRightItemTemplate.bind({})
MultiCardWithRightItem.args = {
  text: "Folder 1",
  caption: "Some caption",
}

export const MultiCardFull = MultiCardFullTemplate.bind({})
MultiCardFull.args = {
  text: "Folder 1",
  caption: "Some caption",
}
export const MultiCardFullButton = MultiCardFullButtonTemplate.bind({})
MultiCardFullButton.args = {
  text: "Folder 1",
  caption: "Some caption",
}

export default cardMeta
