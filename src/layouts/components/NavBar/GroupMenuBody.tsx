import { FormControl, VStack, Text } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import _ from "lodash"

import { Editable } from "components/Editable"
import { AddSectionButton } from "components/Editable/AddSectionButton"

import { useEditableContext } from "contexts/EditableContext"

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
        <FormLabel>Menu group name</FormLabel>
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
          placeholder="Enter a /page-url or link for this menu item"
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
                <VStack p={0} spacing="0.75rem">
                  {sublinks.map((sublink, sublinkIndex) => (
                    <Editable.DraggableAccordionItem
                      draggableId={`sublink-${index}-${sublinkIndex}-draggable`}
                      index={sublinkIndex}
                      title={sublink.title}
                      isInvalid={_.some(errors.sublinks[sublinkIndex])}
                      isNested
                    >
                      <Editable.Section mt="-0.5rem">
                        <FormControl
                          isRequired
                          isInvalid={!!errors.sublinks[sublinkIndex].title}
                        >
                          <FormLabel>Submenu name</FormLabel>
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
                            placeholder="Enter a /page-url or link for this menu item"
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
