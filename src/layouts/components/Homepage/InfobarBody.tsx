import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@opengovsg/design-system-react"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"

interface InfobarFormFields {
  title: string
  subtitle: string
  description: string
  button: string
  url: string
}

interface InfobarBodyProps extends InfobarFormFields {
  index: number
  errors: InfobarFormFields
}

export const InfobarBody = ({
  title,
  subtitle,
  description,
  button,
  url,
  index,
  errors,
}: InfobarBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  return (
    <Editable.Section>
      <FormControl isRequired isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-infobar-subtitle`}
          value={subtitle}
          onBlur={onChange}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your infobar title goes here"
          id={`section-${index}-infobar-title`}
          value={title}
          onBlur={onChange}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="This paragraph appears below the title and conveys information"
          id={`section-${index}-infobar-description`}
          value={description}
          onBlur={onChange}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.button}>
        <FormLabel>Button text</FormLabel>
        <Input
          placeholder="This is a button"
          id={`section-${index}-infobar-button`}
          value={button}
          onBlur={onChange}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.button}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.url}>
        <FormLabel>Button link</FormLabel>
        <Input
          placeholder="Insert /page-url or https://"
          id={`section-${index}-infobar-url`}
          value={url}
          onBlur={onChange}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Infobar Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Delete infobar
      </Button>
    </Editable.Section>
  )
}
