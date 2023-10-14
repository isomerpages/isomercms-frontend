import { FormControl, VStack, Text, Divider } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiPlus } from "react-icons/bi"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

interface infoboxFormFields {
  title: string
  description?: string
}

interface InfocolsSectionFormFields {
  title: string
  subtitle?: string
  url?: string
  linktext?: string
  infoboxes: infoboxFormFields[]
}

interface InfocolsSectionProps extends InfocolsSectionFormFields {
  index: number
  errors: Omit<InfocolsSectionFormFields, "infoboxes">
  infoboxErrors: infoboxFormFields[]
}

const MAX_INFO_BOXES = 4

export const InfocolsSectionBody = ({
  title,
  subtitle,
  url,
  linktext,
  infoboxes = [],
  index,
  errors,
  infoboxErrors = [],
}: InfocolsSectionProps) => {
  const { onChange, onDelete, onDragEnd, onCreate } = useEditableContext()

  return (
    <Editable.Section>
      {/* Subtitle */}
      <FormControl isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-infocols-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>

      {/* Title */}
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your title goes here"
          id={`section-${index}-infocols-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>

      {/* Link Text */}
      <FormControl isInvalid={!!errors.linktext}>
        <FormLabel>Link text</FormLabel>
        <Input
          placeholder="This is shown at the bottom of the section"
          id={`section-${index}-infocols-linktext`}
          value={linktext}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.linktext}</FormErrorMessage>
      </FormControl>

      {/* URL */}
      <FormControl isInvalid={!!errors.linktext}>
        <FormLabel>Link URL</FormLabel>
        <Input
          placeholder="Insert /page-url or https://"
          id={`section-${index}-infocols-url`}
          value={url}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>

      <Divider py="0.5rem" />
      <Text mb="0.5rem" textStyle="h5">
        Infoboxes
      </Text>
      <Text textStyle="body-2" mb="1.5rem">
        You can add up to 4 infoboxes
      </Text>
      <DragDropContext onDragEnd={onDragEnd}>
        <Editable.Droppable width="100%" editableId={`infocolInfobox-${index}`}>
          <Editable.EmptySection
            title="Add an infobox to get started"
            subtitle="You must add at least 1 infobox to this block"
            isEmpty={infoboxes.length === 0}
          >
            <Editable.Accordion>
              <VStack p={0} spacing="0.75rem">
                {infoboxes.map((infobox, infoboxIndex) => (
                  <Editable.DraggableAccordionItem
                    draggableId={`infocolInfobox-${index}-${infoboxIndex}-draggable`}
                    index={infoboxIndex}
                    title={infobox.title}
                    isInvalid={_.some(infoboxErrors[infoboxIndex])}
                    isNested
                  >
                    <Editable.Section>
                      {/* infobox Title */}
                      <FormControl
                        isRequired
                        isInvalid={!!infoboxErrors[infoboxIndex]?.title}
                      >
                        <FormLabel>Title</FormLabel>
                        <Input
                          placeholder="This is a title for the infobox"
                          id={`infocolInfobox-${index}-${infoboxIndex}-title`}
                          value={infobox.title}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {infoboxErrors[infoboxIndex]?.title}
                        </FormErrorMessage>
                      </FormControl>

                      {/* infobox Description */}
                      <FormControl
                        isInvalid={!!infoboxErrors[infoboxIndex]?.description}
                      >
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="This is a description for the infobox. We recommend keeping it short and succinct."
                          id={`infocolInfobox-${index}-${infoboxIndex}-description`}
                          value={infobox.description}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {infoboxErrors[infoboxIndex]?.description}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        id={`infocolInfobox-${index}-${infoboxIndex}`}
                        onClick={() =>
                          onDelete(
                            `infocolInfobox-${index}-${infoboxIndex}`,
                            "infobox"
                          )
                        }
                        alignSelf="center"
                        variant="clear"
                        colorScheme="critical"
                      >
                        Delete infobox
                      </Button>
                    </Editable.Section>
                  </Editable.DraggableAccordionItem>
                ))}
              </VStack>
            </Editable.Accordion>
          </Editable.EmptySection>
        </Editable.Droppable>
      </DragDropContext>
      <Button
        id={`infocolInfobox-${index}-create`}
        variant="outline"
        w="full"
        pt="0.5rem"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={infoboxes.length >= MAX_INFO_BOXES}
        onClick={() => {
          onCreate({
            target: {
              id: `infocolInfobox-${index}`,
            },
          })
        }}
      >
        Add infobox
      </Button>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Info-columns Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Delete info-column
      </Button>
    </Editable.Section>
  )
}
