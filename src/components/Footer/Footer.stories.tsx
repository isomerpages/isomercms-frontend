import { Button } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { Footer } from "./Footer"

const footerMeta = {
  title: "Components/Footer",
  component: Footer,
} as ComponentMeta<typeof Footer>

interface TemplateArgs {
  buttonText: string
}

const SingleButtonFooterTemplate: Story<TemplateArgs> = ({
  buttonText,
}: TemplateArgs) => {
  return (
    <Footer>
      <Button>{buttonText}</Button>
    </Footer>
  )
}

interface MultiButtonFooterTemplateArgs extends TemplateArgs {
  secondButtonText: string
}
const MultiButtonFooterTemplate: Story<MultiButtonFooterTemplateArgs> = ({
  buttonText,
  secondButtonText,
}: MultiButtonFooterTemplateArgs) => {
  return (
    <Footer>
      <Button>{buttonText}</Button>
      <Button>{secondButtonText}</Button>
    </Footer>
  )
}

export const SingleButtonFooter = SingleButtonFooterTemplate.bind({})
SingleButtonFooter.args = {
  buttonText: "Button",
}
export const MultiButtonFooter = MultiButtonFooterTemplate.bind({})
MultiButtonFooter.args = {
  buttonText: "Button 1",
  secondButtonText: "Button 2",
}

export default footerMeta
