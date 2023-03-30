import { Icon, Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"
import { BiChevronDownCircle, BiCog, BiBulb, BiGroup } from "react-icons/bi"

import {
  DisplayCard,
  DisplayCardHeader,
  DisplayCardTitle,
  DisplayCardCaption,
  DisplayCardContent,
  DisplayCardFooter,
} from "./DisplayCard"

const displayCardMeta = {
  title: "Components/Display Card",
  component: DisplayCard,
} as ComponentMeta<typeof DisplayCard>

interface HeaderDisplayCardTemplateArgs {
  title: string
  hasDivider?: boolean
  caption?: string
  icon?: JSX.Element
  button?: JSX.Element
}

interface ContentDisplayCardTemplateArgs {
  content: string
  footer?: string
}

type FullDisplayCardTemplateArgs = HeaderDisplayCardTemplateArgs &
  ContentDisplayCardTemplateArgs

const headerTemplate: Story<HeaderDisplayCardTemplateArgs> = ({
  title,
  hasDivider,
  caption,
  icon,
  button,
}: HeaderDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="header">
      <DisplayCardHeader button={button}>
        <DisplayCardTitle icon={icon} hasDivider={hasDivider}>
          {title}
        </DisplayCardTitle>
        <DisplayCardCaption>{caption}</DisplayCardCaption>
      </DisplayCardHeader>
    </DisplayCard>
  )
}

const contentTemplate: Story<ContentDisplayCardTemplateArgs> = ({
  content,
  footer,
}: ContentDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="content">
      <DisplayCardContent>{content}</DisplayCardContent>
      {footer && <DisplayCardFooter>{footer}</DisplayCardFooter>}
    </DisplayCard>
  )
}

const fullTemplate: Story<FullDisplayCardTemplateArgs> = ({
  title,
  hasDivider,
  caption,
  icon,
  button,
  content,
  footer,
}: FullDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="full">
      <DisplayCardHeader button={button}>
        <DisplayCardTitle icon={icon} hasDivider={hasDivider}>
          {title}
        </DisplayCardTitle>
        <DisplayCardCaption>{caption}</DisplayCardCaption>
      </DisplayCardHeader>
      <DisplayCardContent>{content}</DisplayCardContent>
      {footer && <DisplayCardFooter>{footer}</DisplayCardFooter>}
    </DisplayCard>
  )
}

export const onlyHeader = headerTemplate.bind({})
onlyHeader.args = {
  title: "Card title",
  caption: "Card caption",
  icon: <Icon as={BiBulb} fontSize="1.5rem" />,
}

export const headerWithUnderline = headerTemplate.bind({})
headerWithUnderline.args = {
  title: "Card title",
  caption: "Card caption",
  hasDivider: true,
}

export const headerWithButton = headerTemplate.bind({})
headerWithButton.args = {
  title: "Site settings",
  caption: "Manage site footer, links, logos, and more",
  icon: <Icon as={BiCog} fontSize="1.5rem" />,
  button: (
    <Button
      variant="link"
      textStyle="subhead-1"
      color="text.title.brand"
      marginRight="0.75rem"
    >
      Manage
    </Button>
  ),
}

export const onlyContent = contentTemplate.bind({})
onlyContent.args = {
  content: "This is the content of the card",
}

export const contentWithFooter = contentTemplate.bind({})
contentWithFooter.args = {
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export const headerAndContent = fullTemplate.bind({})
headerAndContent.args = {
  title: "Pending reviews",
  caption: "Changes to be approved before they can be published",
  icon: <Icon as={BiChevronDownCircle} fontSize="1.5rem" />,
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export const fullDisplayCard = fullTemplate.bind({})
fullDisplayCard.args = {
  title: "This is a review request title",
  hasDivider: true,
  caption: "#123 created by john@example.com on 1 January 2021, 12:00PM",
  icon: <Icon as={BiGroup} fontSize="1.5rem" />,
  button: (
    <Button
      variant="link"
      textStyle="subhead-1"
      color="text.title.brand"
      marginRight="0.75rem"
    >
      Manage
    </Button>
  ),
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export default displayCardMeta
