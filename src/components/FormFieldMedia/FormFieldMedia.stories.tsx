import { Story, Meta } from "@storybook/react"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import React from "react"

import FormMediaInput from "./FormMediaInput"
import "./FormFieldMedia.scss"

import FormFieldMedia from "./index"

const formFieldMeta = {
  title: "FormFieldMedia",
  component: FormFieldMedia,
} as Meta<typeof FormFieldMedia>

interface FormFieldProps {
  hasError: boolean
  errorMessage: string
  formTitle: string
  formDescription: string
  placeholder: string
  inlineButtonText: string
}

const Template: Story<FormFieldProps> = ({
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

export const ImageFormField = Template.bind({})

ImageFormField.args = {
  errorMessage: "something went wrong",
  formTitle: "some title",
  formDescription: "hello world",
  placeholder: "some placeholder",
  inlineButtonText: "select",
  hasError: false,
}

export default formFieldMeta
