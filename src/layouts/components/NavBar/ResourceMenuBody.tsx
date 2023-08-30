import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"

interface ResourcesFormFields {
  title: string
}

interface ResourcesBodyProps extends ResourcesFormFields {
  index: number
  errors: ResourcesFormFields
}

export const ResourceMenuBody = ({
  title,
  index,
  errors,
}: ResourcesBodyProps) => {
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
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`link-${index}`, "Resource Room Link")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
      >
        Remove resource room link
      </Button>
    </Editable.Section>
  )
}
