import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"

interface PagesFormFields {
  title: string
  url: string
}

interface PagesBodyProps extends PagesFormFields {
  index: number
  errors: PagesFormFields
}

export const PageMenuBody = ({ title, url, index, errors }: PagesBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  return (
    <Editable.Section>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Menu Item Name</FormLabel>
        <Input
          placeholder="This is displayed on the navigation bar"
          id={`link-${index}-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.url}>
        <FormLabel>Destination</FormLabel>
        <Input
          placeholder="/permalink"
          id={`link-${index}-url`}
          value={url}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`link-${index}`, "Page Link")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
      >
        Remove single page link
      </Button>
    </Editable.Section>
  )
}
