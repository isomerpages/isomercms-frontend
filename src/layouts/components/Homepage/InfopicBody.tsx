import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { useFormContext } from "react-hook-form"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { Editable } from "layouts/components/Editable"

interface HomepageInfopicSection {
  // NOTE: This type is a lie.
  // we don't distinguish here due to the typing on the library
  // but this is a discriminated union by the type of the section.
  // This means that, for example, `subtitle` WILL NOT exist on a `title` section.
  EditHomepage: {
    infopic: {
      title: string
      subtitle: string
      description: string
      button: string
      url: string
      alt: string
    }
  }[]
}

interface InfopicFormFields {
  subtitle: string
  title: string
  description: string
  button: string
  url: string
  alt: string
}

interface InfopicBodyProps extends InfopicFormFields {
  index: number
  onClick: () => void
  onChange: () => void
  errors: InfopicFormFields & { image: string }
  image: string
}

export const InfopicBody = ({
  errors,
  index,
  onClick,
  onChange,
  title,
  subtitle,
  description,
  button,
  url,
  alt,
  image,
}: InfopicBodyProps) => {
  return (
    <Editable.Section>
      <FormControl isInvalid={!!errors.subtitle}>
        <FormLabel>Infopic subtitle</FormLabel>
        <Input
          placeholder="Infopic subtitle"
          id={`section-${index}-infopic-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>Infopic title</FormLabel>
        <Input
          placeholder="Infopic title"
          id={`section-${index}-infopic-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Infopic description</FormLabel>
        <Input
          placeholder="Infopic description"
          id={`section-${index}-infopic-description`}
          value={description}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.button}>
        <FormLabel>Infopic button name</FormLabel>
        <Input
          placeholder="Infopic button name"
          id={`section-${index}-infopic-button`}
          value={button}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.button}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.url}>
        <FormLabel>Infopic button URL</FormLabel>
        <Input
          placeholder="Insert /page-url or https://"
          id={`section-${index}-infopic-url`}
          value={url}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>
      <FormContext
        hasError={!!errors.image}
        onFieldChange={onChange}
        isRequired
      >
        <FormTitle>Infopic image URL</FormTitle>
        <FormFieldMedia
          value={image}
          id={`section-${index}-infopic-image`}
          inlineButtonText="Select"
        />
        <FormError>{errors.image}</FormError>
      </FormContext>
      <FormControl isRequired isInvalid={!!errors.alt}>
        <FormLabel>Infopic image alt text</FormLabel>
        <Input
          placeholder="Infopic image alt text"
          id={`section-${index}-infopic-alt`}
          value={alt}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.alt}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={onClick}
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
