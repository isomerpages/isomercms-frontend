import { FormControl, Box } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@opengovsg/design-system-react"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "layouts/components/Editable"

interface InfopicFormFields {
  title: string
  subtitle: string
  description: string
  button: string
  url: string
  alt: string
}

interface InfopicBodyProps extends InfopicFormFields {
  index: number
  onClick: () => void
  errors: InfopicFormFields & { image: string }
  image: string
}

export const InfopicBody = ({
  errors,
  index,
  onClick,
  title,
  subtitle,
  description,
  button,
  url,
  alt,
  image,
}: InfopicBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  return (
    <Editable.Section>
      <FormControl isRequired isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-infopic-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your infopic title goes here"
          id={`section-${index}-infopic-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="This paragraph appears below the title and conveys information"
          id={`section-${index}-infopic-description`}
          value={description}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.button}>
        <FormLabel>Button text</FormLabel>
        <Input
          placeholder="This is a button at the bottom of the infopic"
          id={`section-${index}-infopic-button`}
          value={button}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.button}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.url}>
        <FormLabel>Button link</FormLabel>
        <Input
          placeholder="Insert /page-url or https://"
          id={`section-${index}-infopic-url`}
          value={url}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>
      <Box w="100%">
        <FormContext
          hasError={!!errors.image}
          onFieldChange={onChange}
          isRequired
        >
          <Box mb="0.75rem">
            <FormTitle>Image</FormTitle>
          </Box>
          <FormFieldMedia
            value={image}
            id={`section-${index}-infopic-image`}
            inlineButtonText="Browse"
          />
          <FormError>{errors.image}</FormError>
        </FormContext>
      </Box>
      <FormControl isRequired isInvalid={!!errors.alt}>
        <FormLabel>Alt text</FormLabel>
        <Input
          placeholder="Add a descriptive text about the image"
          id={`section-${index}-infopic-alt`}
          value={alt}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.alt}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Infopic Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Delete infopic
      </Button>
    </Editable.Section>
  )
}
