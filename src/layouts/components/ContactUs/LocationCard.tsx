import { VStack, FormControl, Flex, Icon, Box, Text } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  Button,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiInfoCircle } from "react-icons/bi"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"
import { AddSectionButton } from "../Editable/AddSectionButton"

export type LocationCardFrontMatter = {
  address: string[]
  operating_hours: Array<{
    days: string
    time: string
    description: string
  }>
  maps_link: string
  title: string
}

type LocationCardProps = {
  index: number
  frontMatter: LocationCardFrontMatter
  errors: LocationCardFrontMatter
}

const getHasErrors = (errors: LocationCardFrontMatter) => {
  return (
    _.some(errors.address, (error) => error.length > 0) ||
    _.some(errors.operating_hours, (section) =>
      _.some(section, (error) => error.length > 0)
    ) ||
    errors.maps_link.length > 0 ||
    errors.title.length > 0
  )
}

export const LocationCard = ({
  index,
  frontMatter,
  errors,
}: LocationCardProps) => {
  const { onChange, onDragEnd, onDelete } = useEditableContext()

  return (
    <Editable.DraggableAccordionItem
      index={index}
      title={frontMatter.title || "New location"}
      draggableId={`locations-${index}`}
      isInvalid={getHasErrors(errors)}
    >
      <Editable.Section mt="-0.5rem">
        {/* Location label */}
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel mt="0.25rem">Label</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id={`locations-${index}-title`}
            onChange={onChange}
            value={frontMatter.title || ""}
            placeholder="This is a title for your location"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        {/* Location address */}
        <FormControl isRequired isInvalid={_.some(errors.address)}>
          <FormLabel mb={0}>Address</FormLabel>
          {frontMatter.address.map((address, addressIndex) => (
            <Box mt="0.5rem">
              <Input
                // TODO: Remove the `id/onChange`
                // and change to react hook forms
                id={`locations-${index}-address-${addressIndex}`}
                onChange={onChange}
                value={address || ""}
                placeholder={`Address Line ${addressIndex + 1}`}
              />
            </Box>
          ))}
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>

        {/* Location link to map */}
        <FormControl isInvalid={!!errors.maps_link}>
          <FormLabel mb="0.5rem">Link to map</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id={`locations-${index}-maps_link`}
            onChange={onChange}
            value={frontMatter.maps_link || ""}
            placeholder="Insert a link here"
          />
          {errors.maps_link ? (
            <FormErrorMessage>{errors.maps_link}</FormErrorMessage>
          ) : (
            <Flex flexDir="row" mt="0.75rem">
              <Icon
                as={BiInfoCircle}
                fill="base.content.brand"
                mr="0.5rem"
                fontSize="1rem"
              />
              <Text textStyle="caption-2" color="base.content.medium">
                If you leave this blank, we&apos;ll generate one from the
                address above
              </Text>
            </Flex>
          )}
        </FormControl>

        {/* Location operating hours */}
        <Text textStyle="h6" my="0.5rem">
          Operating hours
        </Text>
        <DragDropContext onDragEnd={onDragEnd}>
          <Editable.Droppable
            width="100%"
            editableId={`locations-${index}-operating_hours`}
          >
            <Editable.EmptySection
              title="Operating hours you add will appear here"
              subtitle="Tell visitors when your locations are open"
              isEmpty={frontMatter.operating_hours.length === 0}
            >
              <Editable.Accordion>
                <VStack p={0} spacing="1.125rem">
                  {frontMatter.operating_hours.map(
                    (operatingHour, operatingHourIndex) => (
                      <Editable.DraggableAccordionItem
                        index={operatingHourIndex}
                        title={operatingHour.days || "New operating hours"}
                        draggableId={`locations-${index}-operating_hours-${operatingHourIndex}`}
                        isInvalid={_.some(
                          errors.operating_hours[operatingHourIndex]
                        )}
                        isNested
                      >
                        <Editable.Section mt="-0.5rem">
                          <FormControl
                            isRequired
                            isInvalid={
                              !!errors.operating_hours[operatingHourIndex].days
                            }
                          >
                            <FormLabel mt="0.25rem" mb="0.5rem">
                              Days (e.g., Mon - Fri)
                            </FormLabel>
                            <Input
                              // TODO: Remove the `id/onChange`
                              // and change to react hook forms
                              id={`locations-${index}-operating_hours-${operatingHourIndex}-days`}
                              onChange={onChange}
                              value={operatingHour.days || ""}
                              placeholder="Days of the week"
                            />
                            <FormErrorMessage>
                              {errors.operating_hours[operatingHourIndex].days}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isRequired
                            isInvalid={
                              !!errors.operating_hours[operatingHourIndex].time
                            }
                          >
                            <FormLabel mb="0.5rem">
                              Hours (e.g., 9.30am - 6.00pm)
                            </FormLabel>
                            <Input
                              // TODO: Remove the `id/onChange`
                              // and change to react hook forms
                              id={`locations-${index}-operating_hours-${operatingHourIndex}-time`}
                              onChange={onChange}
                              value={operatingHour.time || ""}
                              placeholder="Hours you are open"
                            />
                            <FormErrorMessage>
                              {errors.operating_hours[operatingHourIndex].time}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.operating_hours[operatingHourIndex]
                                .description
                            }
                          >
                            <FormLabel mb="0.5rem">Description</FormLabel>
                            <Input
                              // TODO: Remove the `id/onChange`
                              // and change to react hook forms
                              id={`locations-${index}-operating_hours-${operatingHourIndex}-description`}
                              onChange={onChange}
                              value={operatingHour.description || ""}
                              placeholder="A short description if needed"
                            />
                            <FormErrorMessage>
                              {
                                errors.operating_hours[operatingHourIndex]
                                  .description
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <Button
                            variant="clear"
                            w="100%"
                            id={`locations-${index}-remove_operating_hours-${operatingHourIndex}`}
                            onClick={() =>
                              onDelete(
                                `locations-${index}-remove_operating_hours-${operatingHourIndex}`,
                                "operating hours"
                              )
                            }
                            alignSelf="center"
                            colorScheme="critical"
                            mt="0.5rem"
                          >
                            Delete operating hours
                          </Button>
                        </Editable.Section>
                      </Editable.DraggableAccordionItem>
                    )
                  )}
                </VStack>
              </Editable.Accordion>
            </Editable.EmptySection>
          </Editable.Droppable>
        </DragDropContext>

        <AddSectionButton
          mt="0.5rem"
          w="100%"
          id={`locations-${index}-add_operating_hours`}
          buttonText="Add operating hours"
          onClick={() =>
            onChange({
              target: {
                id: `locations-${index}-add_operating_hours`,
              },
            })
          }
        />

        <Button
          variant="clear"
          w="100%"
          id={`locations-${index}`}
          onClick={() => onDelete(`locations-${index}`, "location")}
          alignSelf="center"
          colorScheme="critical"
        >
          Delete location
        </Button>
      </Editable.Section>
    </Editable.DraggableAccordionItem>
  )
}
