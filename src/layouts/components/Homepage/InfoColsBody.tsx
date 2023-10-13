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

interface InfoBoxFormFields {
  title: string
  description?: string
}

interface InfoColsSectionFormFields {
  title: string
  subtitle?: string
  url?: string
  linktext?: string
  infoBoxes: InfoBoxFormFields[]
}

interface InfoColsSectionProps extends InfoColsSectionFormFields {
  index: number
  errors: Omit<InfoColsSectionFormFields, "infoboxes">
  infoBoxErrors: InfoBoxFormFields[]
}

const MAX_INFO_BOXES = 4

export const InfoColsSectionBody = ({
  title,
  subtitle,
  url,
  linktext,
  infoBoxes = [],
  index,
  errors,
  infoBoxErrors = [],
}: InfoColsSectionProps) => {
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
        <Editable.Droppable width="100%" editableId={`infoColInfoBox-${index}`}>
          <Editable.EmptySection
            title="Add an infobox to get started"
            subtitle="You must add at least 1 infobox to this block"
            isEmpty={infoBoxes.length === 0}
          >
            <Editable.Accordion>
              <VStack p={0} spacing="0.75rem">
                {infoBoxes.map((infoBox, infoBoxIndex) => (
                  <Editable.DraggableAccordionItem
                    draggableId={`infoColInfoBox-${index}-${infoBoxIndex}-draggable`}
                    index={infoBoxIndex}
                    title={infoBox.title}
                    isInvalid={_.some(infoBoxErrors[infoBoxIndex])}
                    isNested
                  >
                    <Editable.Section>
                      {/* InfoBox Title */}
                      <FormControl
                        isRequired
                        isInvalid={!!infoBoxErrors[infoBoxIndex].title}
                      >
                        <FormLabel>Title</FormLabel>
                        <Input
                          placeholder="This is a title for the infobox"
                          id={`infoColInfoBox-${index}-${infoBoxIndex}-title`}
                          value={infoBox.title}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {infoBoxErrors[infoBoxIndex].title}
                        </FormErrorMessage>
                      </FormControl>

                      {/* InfoBox Description */}
                      <FormControl
                        isInvalid={!!infoBoxErrors[infoBoxIndex].description}
                      >
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="This is a description for the infobox. We recommend keeping it short and succinct."
                          id={`infoColInfoBox-${index}-${infoBoxIndex}-description`}
                          value={infoBox.description}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {infoBoxErrors[infoBoxIndex].description}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        id={`infoColInfoBox-${index}-${infoBoxIndex}`}
                        onClick={() =>
                          onDelete(
                            `infoColInfoBox-${index}-${infoBoxIndex}`,
                            "Infobox"
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
        id={`infoColInfoBox-${index}-create`}
        variant="outline"
        w="full"
        pt="0.5rem"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={infoBoxes.length >= MAX_INFO_BOXES}
        onClick={() => {
          onCreate({
            target: {
              id: `infoColInfoBox-${index}`,
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
        Delete info column
      </Button>
    </Editable.Section>
  )
}
