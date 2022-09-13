import { VStack, FormControl } from "@chakra-ui/react"
import {
  FormLabel,
  Input,
  Textarea,
  ComboboxItem,
  MultiSelect,
} from "@opengovsg/design-system-react"
import { useState } from "react"

const INITIAL_COMBOBOX_ITEMS: ComboboxItem[] = [
  {
    value: "A",
    label: "A",
  },
  {
    value: "What happens when the label is fairly long",
    label: "What happens when the label is fairly long",
  },
  {
    value: "C",
    label: "C",
  },
  {
    value: "D",
    label: "D",
  },
  {
    value: "A1",
    label: "A1",
  },
  {
    value: "B2",
    label: "B2",
  },
  {
    value: "Bat3",
    label: "Bat3",
  },
  {
    value: "C4",
    label: "C4",
  },
  {
    value: "D5",
    label: "D5",
    disabled: true,
  },
]

export const ReviewRequestForm = (): JSX.Element => {
  // TODO: add a fetch for the admins of this repo
  const [reviewers, setReviewers] = useState<string[]>([])
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
        <MultiSelect
          onChange={setReviewers}
          name="multi"
          values={reviewers}
          items={INITIAL_COMBOBOX_ITEMS}
          placeholder="Select Admins to add as reviewers"
        />
      </FormControl>
    </VStack>
  )
}
