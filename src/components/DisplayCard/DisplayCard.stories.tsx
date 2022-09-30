import { Icon, Box } from "@chakra-ui/react"
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

interface onlyHeaderDisplayCardTemplateArgs {
  title: string
  hasUnderline?: boolean
  caption?: string
  icon?: JSX.Element
  button?: JSX.Element
}

interface onlyContentDisplayCardTemplateArgs {
  content: string
  footer?: string
}

type FullDisplayCardTemplateArgs = onlyHeaderDisplayCardTemplateArgs &
  onlyContentDisplayCardTemplateArgs

const onlyHeaderTemplate: Story<onlyHeaderDisplayCardTemplateArgs> = ({
  title,
  hasUnderline,
  caption,
  icon,
  button,
}: onlyHeaderDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="onlyHeader">
      <DisplayCardHeader button={button}>
        <Box>
          <DisplayCardTitle icon={icon} hasUnderline={hasUnderline}>
            {title}
          </DisplayCardTitle>
          {caption && <DisplayCardCaption>{caption}</DisplayCardCaption>}
        </Box>
      </DisplayCardHeader>
    </DisplayCard>
  )
}

const onlyContentTemplate: Story<onlyContentDisplayCardTemplateArgs> = ({
  content,
  footer,
}: onlyContentDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="onlyContent">
      <DisplayCardContent>{content}</DisplayCardContent>
      {footer && <DisplayCardFooter>{footer}</DisplayCardFooter>}
    </DisplayCard>
  )
}

const headerAndContentTemplate: Story<FullDisplayCardTemplateArgs> = ({
  title,
  hasUnderline,
  caption,
  icon,
  button,
  content,
  footer,
}: FullDisplayCardTemplateArgs) => {
  return (
    <DisplayCard variant="headerAndContent">
      <DisplayCardHeader button={button}>
        <DisplayCardTitle icon={icon} hasUnderline={hasUnderline}>
          {title}
        </DisplayCardTitle>
        {caption && <DisplayCardCaption>{caption}</DisplayCardCaption>}
      </DisplayCardHeader>
      <DisplayCardContent>{content}</DisplayCardContent>
      {footer && <DisplayCardFooter>{footer}</DisplayCardFooter>}
    </DisplayCard>
  )
}

export const onlyHeader = onlyHeaderTemplate.bind({})
onlyHeader.args = {
  title: "Card title",
  caption: "Card caption",
  icon: <Icon as={BiBulb} fontSize="1.5rem" />,
}

export const onlyHeaderWithUnderline = onlyHeaderTemplate.bind({})
onlyHeaderWithUnderline.args = {
  title: "Card title",
  caption: "Card caption",
  hasUnderline: true,
}

export const onlyHeaderWithButton = onlyHeaderTemplate.bind({})
onlyHeaderWithButton.args = {
  title: "Site settings",
  caption: "Manage site footer, links, logos, and more",
  icon: <Icon as={BiCog} fontSize="1.5rem" />,
  button: <Button variant="reverse">Manage</Button>,
}

export const onlyContent = onlyContentTemplate.bind({})
onlyContent.args = {
  content: "This is the content of the card",
}

export const onlyContentWithFooter = onlyContentTemplate.bind({})
onlyContentWithFooter.args = {
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export const headerAndContent = headerAndContentTemplate.bind({})
headerAndContent.args = {
  title: "Pending reviews",
  caption: "Changes to be approved before they can be published",
  icon: <Icon as={BiChevronDownCircle} fontSize="1.5rem" />,
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export const fullDisplayCard = headerAndContentTemplate.bind({})
fullDisplayCard.args = {
  title: "This is a review request title",
  hasUnderline: true,
  caption: "#123 created by john@example.com on 1 January 2021, 12:00PM",
  icon: <Icon as={BiGroup} fontSize="1.5rem" />,
  button: <Button variant="reverse">Manage</Button>,
  content: "This is the content of the card",
  footer: "This is the footer of the card",
}

export default displayCardMeta
