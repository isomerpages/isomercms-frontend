import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"

interface AnnouncementBlockFormFields {
  title: string
  subtitle: string
  children: React.ReactNode
}

interface AnnouncementBodyProps extends AnnouncementBlockFormFields {
  index: number
  errors: AnnouncementBlockFormFields
}

export const AnnouncementSection = ({
  title,
  subtitle,
  index,
  errors,
  children,
}: AnnouncementBodyProps) => {
  const { onChange, onDelete } = useEditableContext()

  return (
    <Editable.Section>
      <FormControl isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-announcementBlock-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your title goes here"
          id={`section-${index}-announcementBlock-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>

      {children}
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Announcement Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Delete announcements block
      </Button>
    </Editable.Section>
  )
}
