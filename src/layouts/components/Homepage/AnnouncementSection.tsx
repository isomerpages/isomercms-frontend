import { Divider, FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

interface AnnouncementsFormFields {
  title: string
  subtitle: string
}

interface AnnouncementSectionProps extends AnnouncementsFormFields {
  index: number
  errors: AnnouncementsFormFields
  children: React.ReactNode
}

export const AnnouncementSection = ({
  title,
  subtitle,
  index,
  errors,
  children,
}: AnnouncementSectionProps) => {
  const { onChange, onDelete } = useEditableContext()
  return (
    <Editable.Section>
      <FormControl isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-announcements-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors?.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your title goes here"
          id={`section-${index}-announcements-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <Divider />

      {children}
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Announcement Block")}
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
