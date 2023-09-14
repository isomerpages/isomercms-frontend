import { Text, Box, FormControl, VStack } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  DateRangePicker,
  DatePicker,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiPlus } from "react-icons/bi"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "layouts/components/Editable"

import { Announcement } from "types/announcements"
import { AnnouncementOption } from "types/homepage"

const MAX_ANNOUNCEMENTS = 5

interface AnnouncementBodyFormFields {
  button: string
  url: string
}
interface AnnouncementBodyProps extends AnnouncementBodyFormFields {
  errors: AnnouncementBodyFormFields & {
    announcements: AnnouncementOption[]
  }
  announcements: Partial<AnnouncementOption>[]
}

export const AnnouncementBody = ({
  errors,
  button,
  url,
  announcements = [],
}: AnnouncementBodyProps) => {
  const {
    onDragEnd,
    onChange,
    onCreate,
    onDelete,
    onDisplay,
  } = useEditableContext()
  console.log("in announcement body")
  console.log({ errors, button, url, announcements })
  return (
    <Box w="full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Editable.Droppable editableId="announcement">
          <VStack spacing="1.25rem" align="flex-start" p={0} />
          <Text mt="1.5rem" textStyle="h6">
            Announcements
          </Text>
          <Text mt="0.5rem" textStyle="body-2" textColor="base.content.medium">
            You can display up to 5 announcements at a time. Newly added
            announcements are shown on the top of the list
          </Text>

          <Editable.Accordion onChange={() => onDisplay("announcement")}>
            <Editable.EmptySection
              isEmpty={announcements.length === 0}
              title="Announcements you add will appear here"
              subtitle=""
            >
              <Editable.Section px={0} spacing="0.75rem" py="1.5rem">
                {announcements.map(
                  (
                    {
                      title: announcementTitle,
                      date: announcementDate,
                      announcementContent,
                      linkText: announcementLinkText,
                      linkUrl: announcementLinkUrl,
                    },
                    announcementIndex
                  ) => {
                    return (
                      <Editable.DraggableAccordionItem
                        title={announcementTitle || "New announcement"}
                        draggableId={`announcement-${announcementIndex}-draggable`}
                        index={announcementIndex}
                        isInvalid={_.some(
                          errors.announcements[announcementIndex]
                        )}
                        isNested
                      >
                        <Editable.Section>
                          <FormControl
                            isInvalid={
                              !!errors.announcements[announcementIndex].title
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
                              {errors.announcements[announcementIndex].title}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcements[announcementIndex].date
                            }
                            isRequired
                          >
                            <FormLabel>Date</FormLabel>
                            <DatePicker
                              placeholder="announcement description"
                              id={`announcement-${announcementIndex}-date`}
                              inputValue={announcementDate}
                              onInputValueChange={(value) => {
                                console.log(value)
                                onChange({
                                  target: {
                                    id: `announcement-${announcementIndex}-date`,
                                    value,
                                  },
                                })
                              }}
                            />
                            <FormErrorMessage>
                              {errors.announcements[announcementIndex].date}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcements[announcementIndex]
                                .announcementContent
                            }
                            isRequired
                          >
                            <FormLabel>Announcement</FormLabel>
                            <Textarea
                              placeholder="This is a space for your announcement. This text appears next to the announcement title. You can link a relevant page if you need to elaborate on your announcement."
                              id={`announcement-${announcementIndex}-announcementContent`}
                              value={announcementContent}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {
                                errors.announcements[announcementIndex]
                                  .announcementContent
                              }
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcements[announcementIndex].linkText
                            }
                            isRequired
                          >
                            <FormLabel optionalIndicator>Link text</FormLabel>
                            <Input
                              placeholder="Learn more"
                              id={`announcement-${announcementIndex}-linkText`}
                              value={announcementLinkText}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {errors.announcements[announcementIndex].linkText}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl
                            isInvalid={
                              !!errors.announcements[announcementIndex].linkUrl
                            }
                            isRequired
                          >
                            <FormLabel optionalIndicator>Link URL</FormLabel>
                            <Input
                              placeholder="Insert /page-url or https:  "
                              id={`announcement-${announcementIndex}-linkUrl`}
                              value={announcementLinkUrl}
                              onChange={onChange}
                            />
                            <FormErrorMessage>
                              {errors.announcements[announcementIndex].linkUrl}
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
        id={`announcement-${announcements.length}-create`}
        onClick={() => onCreate({ target: { id: "announcement" } })}
        variant="outline"
        w="full"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={announcements.length >= MAX_ANNOUNCEMENTS}
      >
        Add Announcement
      </Button>
    </Box>
  )
}
