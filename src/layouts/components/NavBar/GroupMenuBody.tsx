import { FormControl, VStack, Text } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import _ from "lodash"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"
import { AddSectionButton } from "../Editable/AddSectionButton"

interface SublinkFormFields {
  title: string
  url: string
}
interface GroupsFormFields {
  title: string
  url: string
  sublinks: SublinkFormFields[]
}

interface GroupsBodyProps extends GroupsFormFields {
  index: number
  errors: GroupsFormFields
}

export const GroupMenuBody = ({
  title,
  url,
  sublinks,
  index,
  errors,
}: GroupsBodyProps) => {
  const { onChange, onDelete, onCreate, onDragEnd } = useEditableContext()

  return (
    <Editable.Section>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Menu Group Name</FormLabel>
        <Input
          placeholder="This is displayed on the navigation bar"
          id={`link-${index}-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.url}>
        <FormLabel>Destination</FormLabel>
        <Input
          placeholder="/permalink"
          id={`link-${index}-url`}
          value={url}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.url}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired pt="0.5rem">
        <FormLabel mb="0.5rem" textStyle="h6">
          Submenus
        </FormLabel>
        <Text textStyle="body-2" mb="1.5rem">
          Cards are displayed side by side on a desktop screens
        </Text>
        <DragDropContext onDragEnd={onDragEnd}>
          <Editable.Droppable width="100%" editableId={`sublink-${index}`}>
            <Editable.EmptySection
              title="Submenus you add will appear here"
              subtitle="Add links under your menu group"
              isEmpty={sublinks.length === 0}
            >
              <Editable.Accordion>
                <VStack p={0} spacing="1.25rem">
                  {sublinks.map((sublink, sublinkIndex) => (
                    // Note: contentEditable is required to stop drag and drop from hitting the first level drag and drop
                    <VStack contentEditable w="100%">
                      <Editable.DraggableAccordionItem
                        draggableId={`sublink-${index}-${sublinkIndex}-draggable`}
                        index={sublinkIndex}
                        title={sublink.title}
                        isInvalid={_.some(errors.sublinks[sublinkIndex])}
                      >
                        <Editable.Section mt="-0.5rem">
                          <FormControl
                            isRequired
                            isInvalid={!!errors.sublinks[sublinkIndex].title}
                          >
                            <FormLabel>Submenu Name</FormLabel>
                            <Input
                              placeholder="New menu group"
                              id={`sublink-${index}-${sublinkIndex}-title`}
                              value={sublink.title}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {errors.sublinks[sublinkIndex].title}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isRequired
                            isInvalid={!!errors.sublinks[sublinkIndex].url}
                          >
                            <FormLabel>Destination</FormLabel>
                            <Input
                              placeholder="/permalink"
                              id={`sublink-${index}-${sublinkIndex}-url`}
                              value={sublink.url}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {errors.sublinks[sublinkIndex].url}
                            </FormErrorMessage>
                          </FormControl>
                          <Button
                            id={`section-${index}-${sublinkIndex}`}
                            onClick={() =>
                              onDelete(
                                `sublink-${index}-${sublinkIndex}`,
                                "Submenu"
                              )
                            }
                            alignSelf="center"
                            variant="clear"
                            colorScheme="critical"
                          >
                            Delete submenu
                          </Button>
                        </Editable.Section>
                      </Editable.DraggableAccordionItem>
                    </VStack>
                  ))}
                </VStack>
              </Editable.Accordion>
            </Editable.EmptySection>
          </Editable.Droppable>
        </DragDropContext>
      </FormControl>
      <AddSectionButton
        w="100%"
        pt="0.5rem"
        buttonText="Add submenu"
        onClick={() => {
          onCreate({
            target: {
              id: `sublink-${index}-${sublinks.length}-create`,
              value: "sublinkLink",
            },
          })
        }}
      />
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`link-${index}`, "Menu Group")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
      >
        Delete menu group
      </Button>
    </Editable.Section>
  )
}
