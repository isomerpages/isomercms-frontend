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
  button2Text: string
}
const MultiButtonFooterTemplate: Story<MultiButtonFooterTemplateArgs> = ({
  buttonText,
  button2Text,
}: MultiButtonFooterTemplateArgs) => {
  return (
    <Footer>
      <>
        <Button>{buttonText}</Button>
        <Button>{button2Text}</Button>
      </>
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
  button2Text: "Button 2",
}

export default footerMeta
