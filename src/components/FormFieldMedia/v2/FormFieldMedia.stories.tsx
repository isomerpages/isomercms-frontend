import "@opengovsg/design-system-react/build/fonts/inter.css"
import { FormControl } from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormFieldMessage,
  FormLabel,
  ThemeProvider,
} from "@opengovsg/design-system-react"
import { ComponentStory, ComponentMeta } from "@storybook/react"

import { FormMediaInput } from "./FormMediaInput"
import V2Input from "./FormMediaInput.v2"

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
  isDisabled: boolean
  useV2: boolean
}

const defaultArgs = {
  errorMessage: "something went wrong",
  formTitle: "some title",
  formDescription: "some description",
  placeholder: "some placeholder",
  inlineButtonText: "select",
  hasError: false,
  isRequired: false,
  isDisabled: false,
  useV2: false,
}

const BaseComponent = ({
  hasError,
  errorMessage,
  formTitle,
  formDescription,
  placeholder,
  inlineButtonText,
  isRequired,
  isDisabled,
  useV2,
}: FormFieldProps) => {
  const MediaComponent = useV2 ? V2Input : FormMediaInput

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={hasError}
      isDisabled={isDisabled}
    >
      <FormLabel>{formTitle}</FormLabel>
      <FormFieldMessage>{formDescription}</FormFieldMessage>
      <MediaComponent
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        register={() => {}}
        placeholder={placeholder}
        id="image"
        inlineButtonText={inlineButtonText}
        value=""
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  )
}

const Template: ComponentStory<typeof BaseComponent> = (args) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BaseComponent {...args} />
)

export const FormFieldMedia = Template.bind({})
export const DesignSystemFormFieldMedia = Template.bind({})

FormFieldMedia.args = defaultArgs
DesignSystemFormFieldMedia.args = { ...defaultArgs, useV2: true }

export default formFieldMeta
