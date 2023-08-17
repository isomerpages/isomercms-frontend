import { Text, Box, FormControl, VStack } from "@chakra-ui/react"
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiPlus } from "react-icons/bi"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "layouts/components/Editable"

import { HighlightOption } from "types/homepage"

const MAX_HIGHLIGHTS = 4

interface HeroHighlightSectionFormFields {
  button: string
  url: string
}
interface HeroHighlightSectionProps extends HeroHighlightSectionFormFields {
  errors: HeroHighlightSectionFormFields & {
    highlights: HighlightOption[]
  }
  highlights: Partial<HighlightOption>[]
}

export const HeroHighlightSection = ({
  errors,
  button,
  url,
  highlights,
}: HeroHighlightSectionProps) => {
  const {
    onDragEnd,
    onChange,
    onCreate,
    onDelete,
    onDisplay,
  } = useEditableContext()

  return (
    <Box w="full">
      <Editable.Droppable editableId="highlight" onDragEnd={onDragEnd}>
        <VStack spacing="1.25rem" align="flex-start" p={0}>
          <FormControl isRequired isInvalid={!!errors.button}>
            <FormLabel>Button Text</FormLabel>
            <Input
              id="section-0-hero-button"
              placeholder="This is a button"
              value={button}
              onChange={onChange}
            />
            {/* TODO: Validate button.  
              This isn't being done on prod also.
             */}
            <FormErrorMessage>{errors.button}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.url}>
            <FormLabel>Button URL</FormLabel>
            <Input
              placeholder="Insert /page-url or https://"
              value={url}
              onChange={onChange}
              id="section-0-hero-url"
            />
            <FormErrorMessage>{errors.url}</FormErrorMessage>
          </FormControl>
        </VStack>
        <Text mt="1.5rem" textStyle="h6">
          Highlights
        </Text>
        <Text mt="0.5rem" textStyle="body-2" textColor="base.content.medium">
          Drag and drop highlights to rearrange them. On a desktop screen,
          highlights are shown side-by-side
        </Text>
        {/* TODO: Add `displayHandler` */}
        <Editable.Accordion onChange={() => onDisplay("highlight")}>
          <Editable.EmptySection
            isEmpty={highlights.length === 0}
            title="Highlights you add will appear here"
            subtitle="You can call out informative links using highlights"
          >
            <Editable.Section px={0} spacing="1.25rem" py="1.5rem">
              {highlights.map(
                (
                  {
                    title: highlightTitle,
                    url: highlightUrl,
                    description: highlightDescription,
                  },
                  highlightIndex
                ) => {
                  return (
                    <Editable.DraggableAccordionItem
                      title={highlightTitle || "New highlight"}
                      draggableId={`highlight-${highlightIndex}-draggable`}
                      index={highlightIndex}
                      isInvalid={_.some(errors.highlights[highlightIndex])}
                    >
                      <Editable.Section>
                        <FormControl
                          isInvalid={!!errors.highlights[highlightIndex].title}
                          isRequired
                        >
                          <FormLabel>Title</FormLabel>
                          <Input
                            placeholder="Highlight title"
                            id={`highlight-${highlightIndex}-title`}
                            value={highlightTitle}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.highlights[highlightIndex].title}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            !!errors.highlights[highlightIndex].description
                          }
                          isRequired
                        >
                          <FormLabel>Description</FormLabel>
                          <Input
                            placeholder="Highlight description"
                            id={`highlight-${highlightIndex}-description`}
                            value={highlightDescription}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.highlights[highlightIndex].description}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!errors.highlights[highlightIndex].url}
                          isRequired
                        >
                          <FormLabel>URL</FormLabel>
                          <Input
                            placeholder="Insert /page-url or https://"
                            id={`highlight-${highlightIndex}-url`}
                            value={highlightUrl}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.highlights[highlightIndex].url}
                          </FormErrorMessage>
                        </FormControl>
                        <Button
                          id={`highlight-${highlightIndex}-delete`}
                          onClick={() =>
                            onDelete(
                              `highlight-${highlightIndex}-delete`,
                              "Highlight"
                            )
                          }
                          alignSelf="center"
                          variant="clear"
                          colorScheme="critical"
                          mt="1rem"
                        >
                          Delete option
                        </Button>
                      </Editable.Section>
                    </Editable.DraggableAccordionItem>
                  )
                }
              )}
            </Editable.Section>
          </Editable.EmptySection>
        </Editable.Accordion>
      </Editable.Droppable>
      <Button
        id={`highlight-${highlights.length}-create`}
        onClick={() => onCreate({ target: { id: "highlight" } })}
        variant="outline"
        w="full"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={highlights.length >= MAX_HIGHLIGHTS}
      >
        Add option
      </Button>
    </Box>
  )
}
