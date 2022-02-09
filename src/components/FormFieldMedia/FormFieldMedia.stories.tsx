import "@opengovsg/design-system-react/build/fonts/inter.css"
import { ThemeProvider } from "@opengovsg/design-system-react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"

import FormMediaInput from "./FormMediaInput"
import "./FormFieldMedia.scss"

const formFieldMeta = {
  title: "Components/Form Field Media/v1",
  component: FormMediaInput,
} as ComponentMeta<typeof FormMediaInput>

interface FormFieldProps {
  hasError: boolean
  errorMessage: string
  formTitle: string
  formDescription: string
  placeholder: string
  inlineButtonText: string
}

const defaultArgs = {
  errorMessage: "something went wrong",
  formTitle: "some title",
  formDescription: "hello world",
  placeholder: "some placeholder",
  inlineButtonText: "select",
  hasError: false,
}

const BaseComponent = ({
  hasError,
  errorMessage,
  formTitle,
  formDescription,
  placeholder,
  inlineButtonText,
}: FormFieldProps) => (
  <FormContext
    hasError={hasError}
    onFieldChange={(e) => console.log(e.target.value)}
  >
    <FormTitle>{formTitle}</FormTitle>
    <FormDescription>{formDescription}</FormDescription>
    <FormMediaInput
      register={() => {}}
      placeholder={placeholder}
      id="image"
      inlineButtonText={inlineButtonText}
      value=""
    />
    <FormError>{errorMessage}</FormError>
  </FormContext>
)

const Template: ComponentStory<typeof BaseComponent> = (args) => (
  <BaseComponent {...args} />
)

export const FormFieldMedia = Template.bind({})
export const FormFieldMediaWithTheming = Template.bind({})

FormFieldMediaWithTheming.decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
]

FormFieldMedia.args = defaultArgs
FormFieldMediaWithTheming.args = defaultArgs
export default formFieldMeta
