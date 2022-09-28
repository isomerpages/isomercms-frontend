import { VStack, FormControl } from "@chakra-ui/react"
import { FormLabel, Input, Textarea } from "@opengovsg/design-system-react"
import Select from "react-select"

export interface ReviewRequestFormProps {
  admins: {
    value: string
    label: string
  }[]
}

export const ReviewRequestForm = ({
  admins,
}: ReviewRequestFormProps): JSX.Element => {
  return (
    <VStack align="flex-start" spacing="1.5rem" mt="2rem">
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input type="text" placeholder="Title your request" />
      </FormControl>
      <FormControl>
        <FormLabel>Comments</FormLabel>
        <Textarea
          minH="9rem"
          placeholder="Briefly describe the changes you’ve made, and add a review deadline (if applicable)"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel mb={0}>Reviewers</FormLabel>
        <FormLabel.Description
          useMarkdown
          color="text.description"
          // NOTE: This is done to ensure that the width of the MultiSelect
          // takes the full width of its container.
          // Using a VStack that has full width constrains the width somehow
          // and the MultiSelect itself does not expose a width prop.
          mb="0.75rem"
        >
          Your changes can be published when at least **one** reviewer approves
          your request
        </FormLabel.Description>
        <Select
          options={admins}
          isMulti
          placeholder="Select Admins to add as reviewers"
        />
      </FormControl>
    </VStack>
  )
}
