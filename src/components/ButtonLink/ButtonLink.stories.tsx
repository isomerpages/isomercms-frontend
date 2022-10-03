import { Text } from "@chakra-ui/react"
import { ComponentMeta, Story } from "@storybook/react"

import { ButtonLink } from "./ButtonLink"

const buttonLinkMeta = {
  title: "Components/ButtonLink",
  component: ButtonLink,
} as ComponentMeta<typeof ButtonLink>

interface ButtonLinkTemplateArgs {
  href: string
  text: string
}

const buttonLinkTemplate: Story<ButtonLinkTemplateArgs> = ({
  href,
  text,
}: ButtonLinkTemplateArgs) => {
  return (
    <ButtonLink href={href}>
      <Text color="white">{text}</Text>
    </ButtonLink>
  )
}

export const Default = buttonLinkTemplate.bind({})
Default.args = {
  href: "https://www.google.com",
  text: "Open staging site",
}

export default buttonLinkMeta
