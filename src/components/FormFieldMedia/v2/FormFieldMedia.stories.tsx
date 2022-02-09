import "@opengovsg/design-system-react/build/fonts/inter.css"
import { FormControl, FormHelperText } from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormFieldMessage,
  FormLabel,
  ThemeProvider,
} from "@opengovsg/design-system-react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import FormMediaInput from "./FormMediaInput"

const formFieldMeta = {
  title: "Components/Form Field Media/v2",
  component: FormMediaInput,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as ComponentMeta<typeof FormMediaInput>

interface FormFieldProps {
  isRequired: boolean
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
  isRequired: false,
}

const BaseComponent = ({
  hasError,
  errorMessage,
  formTitle,
  formDescription,
  placeholder,
  inlineButtonText,
  isRequired,
}: FormFieldProps) => (
  <FormControl isRequired={isRequired} isInvalid={hasError}>
    <FormLabel>{formTitle}</FormLabel>
    <FormFieldMessage>{formDescription}</FormFieldMessage>
    <FormMediaInput
      register={() => {}}
      placeholder={placeholder}
      id="image"
      inlineButtonText={inlineButtonText}
      value=""
    />
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
)

const Template: ComponentStory<typeof BaseComponent> = (args) => (
  <BaseComponent {...args} />
)

export const FormFieldMedia = Template.bind({})

FormFieldMedia.args = defaultArgs
export default formFieldMeta
