import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { Editable } from "../Editable"

interface ResourcesInputs {
  title: string
  subtitle: string
  button: string
}

interface ResourcesBodyProps extends ResourcesInputs {
  index: number
  onClick: () => void
  onChange: () => void
  errors: ResourcesInputs
}

export const ResourcesBody = ({
  title,
  subtitle,
  button,
  index,
  onClick,
  onChange,
  errors,
}: ResourcesBodyProps) => (
  <Editable.Section>
    <FormControl isRequired isInvalid={!!errors.subtitle}>
      <FormLabel>Resources section subtitle</FormLabel>
      <Input
        placeholder="Resources section subtitle"
        id={`section-${index}-resources-subtitle`}
        value={subtitle}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.title}>
      <FormLabel>Resources section title</FormLabel>
      <Input
        placeholder="Resources section title"
        id={`section-${index}-resources-title`}
        value={title}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.title}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.button}>
      <FormLabel>Resources button name</FormLabel>
      <Input
        placeholder="Resources button name"
        id={`section-${index}-resources-button`}
        value={button}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.button}</FormErrorMessage>
    </FormControl>
    <Button
      id={`section-${index}`}
      onClick={onClick}
      alignSelf="center"
      variant="clear"
      colorScheme="critical"
      mt="1rem"
    >
      Delete resources
    </Button>
  </Editable.Section>
)
