import { Text, Box, FormControl } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  DatePicker,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import moment from "moment"
import { BiPlus } from "react-icons/bi"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "layouts/components/Editable"

import { AnnouncementError, AnnouncementOption } from "types/homepage"

const MAX_ANNOUNCEMENTS = 5

interface AnnouncementBodyProps {
  errors: {
    announcementItems: AnnouncementError[]
  }
  announcementItems: Partial<AnnouncementOption>[]
}

export const AnnouncementBody = ({
  errors,
  announcementItems = [],
}: AnnouncementBodyProps) => {
  const {
    onDragEnd,
    onChange,
    onCreate,
    onDelete,
    onDisplay,
  } = useEditableContext()
  return (
    <Box w="full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Editable.Droppable editableId="announcement">
          <Text mt="1.5rem" textStyle="h6">
            Announcements
          </Text>
          <Text mt="0.5rem" textStyle="body-2" textColor="base.content.medium">
            {`You can display up to ${MAX_ANNOUNCEMENTS} announcements at a time. Newly added
            announcements are shown on the top of the list`}
          </Text>

          <Editable.Accordion onChange={() => onDisplay("announcement")}>
            <Editable.EmptySection
              isEmpty={announcementItems.length === 0}
              title="Announcements you add will appear here"
              subtitle=""
            >
              <Editable.Section px={0} spacing="0.75rem" py="1.5rem">
                {announcementItems.map(
                  (
                    {
                      title: announcementTitle,
                      date: announcementDate,
                      announcement: announcementContent,
                      link_text: announcementLinkText,
                      link_url: announcementLinkUrl,
                    },
                    announcementIndex
                  ) => {
                    return (
                      <Editable.DraggableAccordionItem
                        title={announcementTitle || "New announcement"}
                        draggableId={`announcement-${announcementIndex}-draggable`}
                        index={announcementIndex}
                        isInvalid={_.some(
                          errors.announcementItems[announcementIndex]
                        )}
                        isNested
                      >
                        <Editable.Section>
                          <FormControl
                            isInvalid={
                              !!errors.announcementItems[announcementIndex]
                                .title
                            }
                            isRequired
                          >
                            <FormLabel>Title</FormLabel>
                            <Input
                              placeholder="Announcement title"
                              id={`announcement-${announcementIndex}-title`}
                              value={announcementTitle}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {
                                errors.announcementItems[announcementIndex]
                                  .title
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcementItems[announcementIndex].date
                            }
                            isRequired
                          >
                            <FormLabel>Date</FormLabel>
                            <DatePicker
                              id={`announcements-${announcementIndex}-date`}
                              inputValue={moment(
                                announcementDate,
                                "DD MMMM YYYY"
                              ).format("DD/MM/YYYY")}
                              onInputValueChange={(value) => {
                                onChange({
                                  target: {
                                    id: `announcement-${announcementIndex}-date`,
                                    value: moment(value, "DD/MM/YYYY").format(
                                      "DD MMMM YYYY"
                                    ),
                                  },
                                })
                              }}
                            />
                            <FormErrorMessage>
                              {errors.announcementItems[announcementIndex].date}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcementItems[announcementIndex]
                                .announcement
                            }
                            isRequired
                          >
                            <FormLabel>Announcement</FormLabel>
                            <Textarea
                              placeholder="This is a space for your announcement. This text appears next to the announcement title. You can link a relevant page if you need to elaborate on your announcement."
                              id={`announcement-${announcementIndex}-announcement`}
                              value={announcementContent}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {
                                errors.announcementItems[announcementIndex]
                                  .announcement
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcementItems[announcementIndex]
                                .link_text
                            }
                          >
                            <FormLabel>Link text</FormLabel>
                            <Input
                              placeholder="Learn more"
                              id={`announcement-${announcementIndex}-link_text`}
                              value={announcementLinkText}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {
                                errors.announcementItems[announcementIndex]
                                  .link_text
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcementItems[announcementIndex]
                                .link_url
                            }
                          >
                            <FormLabel>Link URL</FormLabel>
                            <Input
                              placeholder="Insert /page-url or https:  "
                              id={`announcement-${announcementIndex}-link_url`}
                              value={announcementLinkUrl}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {
                                errors.announcementItems[announcementIndex]
                                  .link_url
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <Button
                            id={`announcement-${announcementIndex}-delete`}
                            onClick={() =>
                              onDelete(
                                `announcement-${announcementIndex}-delete`,
                                "announcement"
                              )
                            }
                            alignSelf="center"
                            variant="clear"
                            colorScheme="critical"
                          >
                            Delete announcement
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
      </DragDropContext>
      <Button
        id={`announcement-${announcementItems.length}-create`}
        onClick={() => onCreate({ target: { id: "announcement" } })}
        variant="outline"
        w="full"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={announcementItems.length >= MAX_ANNOUNCEMENTS}
      >
        Add Announcement
      </Button>
    </Box>
  )
}
