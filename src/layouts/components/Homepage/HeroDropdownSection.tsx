import { Text, Box, FormControl } from "@chakra-ui/react"
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiPlus } from "react-icons/bi"

import { useDragDropContext } from "contexts/DragDropContext"

import { Editable } from "layouts/components/Editable"

import { EditorHeroDropdownSection } from "types/homepage"

export interface HeroDropdownFormFields {
  title: string
  url: string
}

interface HeroDropdownSectionProps {
  onChange: () => void
  onClick: (event: {
    target: {
      id: string
    }
  }) => void
  onCreate: () => void
  errors: {
    dropdownElems: HeroDropdownFormFields[]
    title: string
    dropdown: string
  }
  state: EditorHeroDropdownSection
  title: string
}

export const HeroDropdownSection = ({
  errors,
  onChange,
  onClick,
  state,
  onCreate,
  title,
}: HeroDropdownSectionProps) => {
  const { onDragEnd } = useDragDropContext()

  return (
    <Box>
      <Editable.Droppable editableId="dropdownelem" onDragEnd={onDragEnd}>
        <FormControl isRequired isInvalid={!!errors.dropdown}>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="This is a button"
            value={title}
            onChange={onChange}
          />
          <FormErrorMessage>{errors.dropdown}</FormErrorMessage>
        </FormControl>
        <Text mt="1.5rem" textStyle="h6">
          Dropdown Options
        </Text>
        <Text mt="0.5rem" textStyle="body-2" textColor="base.content.medium">
          Drag and drop dropdown options to rearrange them
        </Text>
        <Editable.Accordion>
          <Editable.EmptySection
            title="Options you add will appear here"
            subtitle="Add options to allow users to quickly navigate your site"
            isEmpty={state.dropdown.options.length === 0}
          >
            <Editable.Section px={0} spacing="1.25rem" py="1.5rem">
              {state.dropdown.options.map(
                (
                  { title: optionTitle, url: optionUrl },
                  dropdownOptionIndex
                ) => {
                  return (
                    <Editable.DraggableAccordionItem
                      title={optionTitle || "New dropdown option"}
                      draggableId={`dropdownelem-${dropdownOptionIndex}-draggable`}
                      index={dropdownOptionIndex}
                      isInvalid={_.some(
                        errors.dropdownElems[dropdownOptionIndex]
                      )}
                    >
                      <Editable.Section>
                        <FormControl
                          isInvalid={
                            !!errors.dropdownElems[dropdownOptionIndex].title
                          }
                          isRequired
                        >
                          <FormLabel>Title</FormLabel>
                          <Input
                            placeholder="Dropdown option title"
                            id={`dropdownelem-${dropdownOptionIndex}-title`}
                            value={optionTitle}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.dropdownElems[dropdownOptionIndex].title}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={
                            !!errors.dropdownElems[dropdownOptionIndex].url
                          }
                          isRequired
                        >
                          <FormLabel>URL</FormLabel>
                          <Input
                            placeholder="Insert /page-url or https://"
                            id={`dropdownelem-${dropdownOptionIndex}-url`}
                            value={optionUrl}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.dropdownElems[dropdownOptionIndex].url}
                          </FormErrorMessage>
                        </FormControl>
                        <Button
                          id={`dropdownelem-${dropdownOptionIndex}-delete`}
                          onClick={() =>
                            onClick({
                              target: {
                                id: `dropdownelem-${dropdownOptionIndex}-delete`,
                              },
                            })
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
        id={`dropdownelem-${state.dropdown.options.length}-create`}
        onClick={onCreate}
        variant="outline"
        w="full"
        leftIcon={<BiPlus fontSize="1.5rem" />}
      >
        Add option
      </Button>
    </Box>
  )
}
