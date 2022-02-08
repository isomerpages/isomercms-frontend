import { ComponentStory, ComponentMeta } from "@storybook/react"
import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter as Router, Route } from "react-router-dom"

import FormFieldMedia from "./index"

const formFieldMeta = {
  title: "FormFieldMedia",
  component: FormFieldMedia,
} as ComponentMeta<typeof FormFieldMedia>

const queryClient = new QueryClient()

const Template: ComponentStory<typeof FormFieldMedia> = (args) => (
  <Router>
    <QueryClientProvider client={queryClient}>
      {/* NOTE: This is required as we nest the modal within the FormFieldMedia */}
      <Route path="/:siteName" component={() => <FormFieldMedia {...args} />} />
    </QueryClientProvider>
  </Router>
)

export const ImageFormField = Template.bind({})

ImageFormField.args = {
  title: "Image Form Field",
  id: "primary",
  value: "some default value",
  errorMessage: "something went wrong",
  isRequired: true,
  onFieldChange: () => console.log("success!"),
  inlineButtonText: "Click me",
  placeholder: "this is a placeholder",
  type: "images",
}

export default formFieldMeta
