import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  UseDisclosureReturn,
  Text,
  Center,
  Divider,
  HStack,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"
import { BiCommentDetail } from "react-icons/bi"

import { useGetComments, useUpdateReadComments } from "hooks/commentsHooks"

import { getDateTimeFromUnixTime } from "utils/date"

import { EmptyChatImage } from "assets/images/EmptyChatImage"
import { CommentProps } from "types/comments"

import { SendCommentForm } from "./SendCommentForm"

export interface CommentItemProps {
  commenterName: string
  commentTime: number
  isNew: boolean
}

const CommentItem = ({
  commenterName,
  commentTime,
  isNew,
  children,
}: PropsWithChildren<CommentItemProps>): JSX.Element => {
  const { date, time } = getDateTimeFromUnixTime(commentTime)
  return (
    <Box
      backgroundColor={isNew ? "primary.100" : "primary.50"}
      p="1rem"
      mb="1rem"
      borderRadius="4px"
    >
      <HStack
        fontSize="0.625rem"
        color="text.helper"
        justifyContent="space-between"
        pb="0.5rem"
      >
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {commenterName}
        </Text>
        <Text whiteSpace="nowrap">{`${date}, ${time}`}</Text>
      </HStack>
      {children}
    </Box>
  )
}

export type CommentsDrawerProps = Pick<
  UseDisclosureReturn,
  "onClose" | "isOpen"
>

export const CommentsDrawer = ({ siteName, requestId }: CommentProps) => {
  const {
    isOpen: isCommentsOpen,
    onOpen: onCommentsOpen,
    onClose: onCommentsClose,
  } = useDisclosure()

  const { data: commentsData, isLoading: isCommentsLoading } = useGetComments({
    siteName,
    requestId,
  })

  const { mutateAsync: updateReadComments } = useUpdateReadComments()

  return (
    <>
      <IconButton
        backgroundColor="background.action.defaultInverse"
        onClick={() => {
          onCommentsOpen()
          // updateReadComments({ siteName, requestId })
        }}
        aria-label="Open comments"
        icon={<BiCommentDetail />}
        variant="clear"
        boxShadow="0 0 0 2px var(--chakra-colors-gray-100)"
        borderRadius="4px"
      />
      <Drawer
        isOpen={isCommentsOpen}
        onClose={onCommentsClose}
        placement="right"
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent px="1rem">
          <DrawerCloseButton
            variant="clear"
            colorScheme="secondary"
            top="1.25rem"
          />
          <DrawerHeader>
            <Text fontSize="1.5rem" color="text.title.alt">
              Comments
            </Text>
            <Text fontWeight="normal" fontSize="0.875rem" color="text.helper">
              Comments apply to all items in this Review request
            </Text>
          </DrawerHeader>
          <DrawerBody
            fontSize="0.875rem"
            whiteSpace="pre-line"
            color="text.body"
          >
            <Stack spacing="2rem" height="100%">
              <Skeleton isLoaded={!isCommentsLoading} flex={1}>
                {commentsData && commentsData.length > 0 ? (
                  commentsData.map((comment) => (
                    <CommentItem
                      commenterName={comment.email}
                      commentTime={comment.createdAt}
                      isNew={comment.isNew}
                    >
                      {comment.message}
                    </CommentItem>
                  ))
                ) : (
                  <Center
                    flex={1}
                    h="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <EmptyChatImage />
                  </Center>
                )}
              </Skeleton>
            </Stack>
          </DrawerBody>
          <Divider borderColor="border.divider.alt" />
          <Box px="1.5rem" pt="1rem">
            <SendCommentForm siteName={siteName} requestId={requestId} />
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  )
}
