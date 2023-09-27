import { Text, Box, FormControl, ExpandedIndex } from "@chakra-ui/react"
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
import React from "react"
import { BiPlus } from "react-icons/bi"

import { Editable } from "components/Editable/Editable"

import { useEditableContext } from "contexts/EditableContext"

import { AnnouncementError, AnnouncementOption } from "types/homepage"

const MAX_ANNOUNCEMENTS = 5

interface AnnouncementBodyProps {
  errors: {
    announcementItems: AnnouncementError[]
  }
  announcementItems: Partial<AnnouncementOption>[]
  displayAnnouncementItems: boolean[]
}

/**
 * User to input a date like 01/01/2000.
 * To be parsed into 01 January 2000.
 * @param date user input string
 * @returns front matter date string
 */
const toTemplateDateFormat = (date?: string) => {
  const formattedDate = moment(date, "DD/MM/YYYY", true).format("DD MMMM YYYY")
  if (formattedDate === "Invalid date") {
    // return original string for validators to catch
    return date
  }
  return formattedDate
}

/**
 * This will parse a date like 01 January 2000
 * into 01/01/2000 for the CMS panel.
 * @param date front matter date string
 * @returns cms panel date string
 */
const toCmsPanelDateFormat = (date?: string) => {
  const formattedDate = moment(date, "DD MMMM YYYY", true).format("DD/MM/YYYY")
  if (formattedDate === "Invalid date") {
    // return original string for validators to catch
    return date
  }
  return formattedDate
}

export const AnnouncementBody = ({
  errors,
  announcementItems = [],
  displayAnnouncementItems = [],
}: AnnouncementBodyProps) => {
  const {
    onDragEnd,
    onChange,
    onCreate,
    onDelete,
    onDisplay,
  } = useEditableContext()
  const [openIndex, setOpenIndex] = React.useState<number>(0)
  console.log(displayAnnouncementItems)

  if (displayAnnouncementItems.length > 0) {
    const newOpenIndex = displayAnnouncementItems.indexOf(true)
    if (newOpenIndex !== openIndex) {
      setOpenIndex(newOpenIndex)
    }
  }
  return (
    <Box w="full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Editable.Droppable editableId="announcement">
          <Text textStyle="h6">Announcements</Text>
          <Text mt="0.5rem" textStyle="body-2" textColor="base.content.medium">
            {`You can display up to ${MAX_ANNOUNCEMENTS} announcements at a time. Newly added
            announcements are shown on the top of the list`}
          </Text>

          <Editable.Accordion
            defaultIndex={0}
            index={openIndex}
            onChange={(idx: ExpandedIndex) => {
              console.log(idx)
              if (typeof idx === "number") {
                // setOpenIndex(idx)
                onDisplay("announcement", idx)
              } else if (
                idx instanceof Array &&
                idx.length > 0 &&
                typeof idx[0] === "number"
              ) {
                // setOpenIndex(idx[0])
                onDisplay("announcement", idx[0])
              } else {
                // setOpenIndex(-1)
                onDisplay("announcement", -1)
              }
            }}
          >
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
                        <Editable.Section
                          onChange={() => {
                            console.log("changed in here")
                            onDisplay("announcement", announcementIndex)
                          }}
                        >
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
                              inputValue={toCmsPanelDateFormat(
                                announcementDate
                              )}
                              onInputValueChange={(value) => {
                                onChange({
                                  target: {
                                    id: `announcement-${announcementIndex}-date`,
                                    value: toTemplateDateFormat(value),
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
                              placeholder="Insert /page-url or https://"
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
        Add announcement
      </Button>
    </Box>
  )
}
