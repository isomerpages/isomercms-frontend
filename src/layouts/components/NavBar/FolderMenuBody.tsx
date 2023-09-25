import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  SingleSelect,
} from "@opengovsg/design-system-react"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

interface Option {
  value: string
  label: string
}

interface FoldersFormFields {
  title: string
  collection: string
}

interface FoldersBodyProps extends FoldersFormFields {
  options: Option[]
  index: number
  errors: FoldersFormFields
}

export const FolderMenuBody = ({
  title,
  collection,
  options,
  index,
  errors,
}: FoldersBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  const collectionDropdownHandler = (newValue: string) => {
    const event = {
      target: {
        id: `link-${index}-collection`,
        value: newValue,
      },
    }

    onChange(event)
  }

  return (
    <Editable.Section>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Menu item name</FormLabel>
        <Input
          placeholder="This is displayed on the navigation bar"
          id={`link-${index}-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.collection}>
        <FormLabel>Folder</FormLabel>
        <SingleSelect
          name="collection"
          isClearable={false}
          items={options}
          value={collection}
          onChange={collectionDropdownHandler}
        />
        <FormErrorMessage>{errors.collection}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`link-${index}`, "Folder Link")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
      >
        Remove folder link
      </Button>
    </Editable.Section>
  )
}
