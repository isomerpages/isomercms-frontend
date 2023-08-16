import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { Editable } from "../Editable"

interface InfobarInputs {
  title: string
  subtitle: string
  description: string
  button: string
  url: string
}

interface InfobarBodyProps extends InfobarInputs {
  index: number
  onClick: () => void
  onChange: () => void
  errors: InfobarInputs
}

export const InfobarBody = ({
  title,
  subtitle,
  description,
  button,
  url,
  index,
  onClick,
  onChange,
  errors,
}: InfobarBodyProps) => (
  <Editable.Section>
    <FormControl isRequired isInvalid={!!errors.subtitle}>
      <FormLabel>Infobar subtitle</FormLabel>
      <Input
        placeholder="Infobar subtitle"
        id={`section-${index}-infobar-subtitle`}
        value={subtitle}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.title}>
      <FormLabel>Infobar title</FormLabel>
      <Input
        placeholder="Infobar title"
        id={`section-${index}-infobar-title`}
        value={title}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.title}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.description}>
      <FormLabel>Infobar description</FormLabel>
      <Input
        placeholder="Infobar description"
        id={`section-${index}-infobar-description`}
        value={description}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.description}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.button}>
      <FormLabel>Infobar button name</FormLabel>
      <Input
        placeholder="Infobar button name"
        id={`section-${index}-infobar-button`}
        value={button}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.button}</FormErrorMessage>
    </FormControl>
    <FormControl isRequired isInvalid={!!errors.url}>
      <FormLabel>Infobar button URL</FormLabel>
      <Input
        placeholder="Insert /page-url or https://"
        id={`section-${index}-infobar-url`}
        value={url}
        onChange={onChange}
      />
      <FormErrorMessage>{errors.url}</FormErrorMessage>
    </FormControl>
    <Button
      id={`section-${index}`}
      onClick={onClick}
      alignSelf="center"
      variant="clear"
      colorScheme="critical"
      mt="1rem"
    >
      Delete infobar
    </Button>
  </Editable.Section>
)
