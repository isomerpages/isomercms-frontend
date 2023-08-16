import { Text, Box, FormControl } from "@chakra-ui/react"
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@opengovsg/design-system-react"

import { useDragDropContext } from "contexts/DragDropContext"

import { Editable } from "layouts/components/Editable"

import { EditorHeroDropdownSection, EditorHomepageState } from "types/homepage"

interface HeroDropdownFormFields {
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
  errors: { dropdownElems: HeroDropdownFormFields[] }
  state: EditorHomepageState
  onCreate: () => void
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
  const dropdownState = state.frontMatter.sections[0]
    .hero as EditorHeroDropdownSection

  const { onDragEnd } = useDragDropContext()

  return (
    <Box>
      <Editable.Droppable editableId="dropdownelem" onDragEnd={onDragEnd}>
        <FormControl isRequired isInvalid={!!errors}>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="This is a button"
            value={title}
            onChange={onChange}
          />
        </FormControl>
        <Text mt="1.5rem" textStyle="h6">
          Dropdown Options
        </Text>
        <Text mt="0.5rem">
          Drag and drop dropdown options to rearrange them
        </Text>
        <Editable.Accordion>
          <Editable.Section px={0} spacing="1.25rem" py="1.5rem">
            {dropdownState.dropdown?.options?.map(
              ({ title: optionTitle, url: optionUrl }, dropdownOptionIndex) => {
                return (
                  <Editable.DraggableAccordionItem
                    title={optionTitle}
                    draggableId={`dropdownelem-${dropdownOptionIndex}-draggable`}
                    index={dropdownOptionIndex}
                  >
                    <Editable.Section>
                      <FormControl
                        isInvalid={
                          !!errors?.dropdownElems?.[dropdownOptionIndex].title
                        }
                      >
                        <FormLabel>Title</FormLabel>
                        <Input
                          placeholder="Dropdown option title"
                          id={`dropdownelem-${dropdownOptionIndex}-title`}
                          value={optionTitle}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {errors?.dropdownElems?.[dropdownOptionIndex].title}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={
                          !!errors?.dropdownElems?.[dropdownOptionIndex].url
                        }
                      >
                        <FormLabel>URL</FormLabel>
                        <Input
                          placeholder="Insert /page-url or https://"
                          id={`dropdownelem-${dropdownOptionIndex}-url`}
                          value={optionUrl}
                          onChange={onChange}
                        />
                        <FormErrorMessage>
                          {errors?.dropdownElems?.[dropdownOptionIndex].url}
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
        </Editable.Accordion>
      </Editable.Droppable>
      <Button
        id={`dropdownelem-${dropdownState.dropdown?.options?.length}-create`}
        onClick={onCreate}
        variant="outline"
        w="full"
      >
        Add option
      </Button>
    </Box>
  )
}
