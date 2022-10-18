import {
  HStack,
  VStack,
  Text,
  Box,
  Avatar,
  Flex,
  Spacer,
  useClipboard,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
} from "@chakra-ui/react"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { useState } from "react"
import { BiLink, BiPlus } from "react-icons/bi"

import { extractInitials, getDateTimeFromUnixTime } from "utils"

import { CommentsDrawer } from "./components/Comments/CommentsDrawer"
import { RequestOverview, EditedItemProps } from "./components/RequestOverview"

export interface ReviewRequestDashboardProps {
  reviewUrl: string
  title: string
  requestor: string
  reviewers: string[]
  reviewRequestedTime: Date
  changedItems: EditedItemProps[]
}
export const ReviewRequestDashboard = ({
  reviewRequestedTime,
  reviewUrl,
  title,
  requestor,
  reviewers,
  changedItems,
}: ReviewRequestDashboardProps): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(reviewUrl)

  return (
    <Box bg="white" w="100%" h="100%">
      <HStack
        h="10.5rem"
        display="flex"
        bg="blue.50"
        justifyContent="space-between"
      >
        <VStack
          pl="9.25rem"
          pr="2rem"
          pt="2rem"
          pb="1.5rem"
          spacing="0.75rem"
          align="flex-start"
          w="100%"
        >
          <Flex w="100%">
            <HStack spacing="0.25rem">
              <Text textStyle="h5">{title}</Text>
              {/* Closes after 1.5s and does not refocus on the button to avoid the outline */}
              <Popover returnFocusOnClose={false} isOpen={hasCopied}>
                <PopoverTrigger>
                  <IconButton
                    icon={<BiLink />}
                    variant="clear"
                    aria-label="link to pull request"
                    onClick={onCopy}
                  />
                </PopoverTrigger>
                <PopoverContent
                  bg="background.action.alt"
                  _focus={{
                    boxShadow: "none",
                  }}
                  w="fit-content"
                >
                  <PopoverArrow bg="background.action.alt" />
                  <PopoverBody>
                    <Text textStyle="body-2" color="text.inverse">
                      Link copied!
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
            <Spacer />
            <ApprovalButton />
          </Flex>
          <SecondaryDetails
            requestor={requestor}
            reviewers={reviewers}
            reviewRequestedTime={reviewRequestedTime}
          />
        </VStack>
        <Flex h="100%" w="7.25rem" pt="2rem" justifyContent="end">
          {/* TODO: swap this to a slide out component and not a drawer */}
          <CommentsDrawer siteName="siteName" requestId={1} />
        </Flex>
      </HStack>
      <Box px="9.25rem">
        <RequestOverview items={changedItems} allowEditing />
      </Box>
    </Box>
  )
}

// NOTE: Utility component exists to soothe over state management
const ApprovalButton = (): JSX.Element => {
  const [isApproved, setIsApproved] = useState(false)

  return (
    <MenuDropdownButton
      colorScheme={isApproved ? "success" : "primary"}
      mainButtonText={isApproved ? "Approved" : "In review"}
      variant="solid"
    >
      <MenuDropdownItem onClick={() => setIsApproved(false)}>
        <Text textStyle="body-1" textColor="text.body" w="100%">
          In review
        </Text>
      </MenuDropdownItem>
      <MenuDropdownItem onClick={() => setIsApproved(true)}>
        <Text textStyle="body-1" textColor="text.success" w="100%">
          Approved
        </Text>
      </MenuDropdownItem>
    </MenuDropdownButton>
  )
}

interface SecondaryDetailsProps {
  requestor: string
  reviewers: string[]
  reviewRequestedTime: Date
}
const SecondaryDetails = ({
  requestor,
  reviewers,
  reviewRequestedTime,
}: SecondaryDetailsProps) => {
  const { date, time } = getDateTimeFromUnixTime(reviewRequestedTime.getTime())
  return (
    <VStack spacing="0.5rem" align="flex-start">
      <Text textStyle="caption-2" textColor="text.helper">
        {`Review requested by ${requestor} on ${date} ${time}`}
      </Text>
      <HStack spacing="0.75rem">
        <Text textStyle="caption-2" textColor="text.helper">
          Reviewers
        </Text>
        <Box>
          {reviewers.map((name, index) => {
            const initials = extractInitials(name)
            return (
              <Avatar
                zIndex={reviewers.length - index}
                border="1px solid white"
                ml="-0.25rem"
                bg="primary.100"
                name={initials}
                textStyle="caption-1"
                textColor="primary.400"
                size="sm"
              />
            )
          })}
          {/* NOTE: Not using design system IconButton as we require sm size */}
          <IconButton
            icon={<BiPlus />}
            aria-label="Add Reviewer"
            variant="outline"
            borderRadius="50%"
            fontSize="1rem"
            size="sm"
            ml="-0.25rem"
            bg="blue.50"
          />
        </Box>
      </HStack>
    </VStack>
  )
}
