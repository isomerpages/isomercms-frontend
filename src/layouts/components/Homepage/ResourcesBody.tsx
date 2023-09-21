import { Flex, FormControl, Icon, Text } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { BiInfoCircle } from "react-icons/bi"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

interface ResourcesFormFields {
  title: string
  subtitle: string
  button: string
}

interface ResourcesBodyProps extends ResourcesFormFields {
  index: number
  errors: ResourcesFormFields
}

export const ResourcesBody = ({
  title,
  subtitle,
  button,
  index,
  errors,
}: ResourcesBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  return (
    // NOTE: Setting negative margin so that the gap is correct.
    // This is because there is inbuilt padding onto the `AccordionPanels`.
    <Editable.Section mt="-0.5rem">
      <Flex flexDir="row" alignItems="flex-start">
        <Icon
          as={BiInfoCircle}
          fill="base.content.brand"
          mr="0.5rem"
          fontSize="1rem"
        />
        <Text textStyle="caption-2">
          This is a widget that appears on your home screen. Removing it will
          not delete the page it links to
        </Text>
      </Flex>
      <FormControl isRequired isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-resources-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your widget title goes here"
          id={`section-${index}-resources-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.button}>
        <FormLabel>Button text</FormLabel>
        <Input
          placeholder="This button appears at the bottom of the widget"
          id={`section-${index}-resources-button`}
          value={button}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.button}</FormErrorMessage>
      </FormControl>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Resources Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Remove resource widget
      </Button>
    </Editable.Section>
  )
}
