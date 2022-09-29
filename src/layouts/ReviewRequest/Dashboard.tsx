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
} from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { useState } from "react"
import { BiLink } from "react-icons/bi"

import { extractInitials, getDateTimeFromUnixTime } from "utils"

import { RequestOverview, EditedItemProps } from "./components/RequestOverview"

export interface ReviewRequestDashboardProps {
  siteName: string
  reviewUrl: string
  title: string
  requestor: string
  reviewers: string[]
  changedItems: EditedItemProps[]
}
export const ReviewRequestDashboard = ({
  siteName,
  reviewUrl,
  title,
  requestor,
  reviewers,
  changedItems,
}: ReviewRequestDashboardProps): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(reviewUrl)

  return (
    <Box bg="white" w="100%" h="100%">
      <VStack
        bg="blue.50"
        pl="9.25rem"
        pr="2rem"
        pt="2rem"
        pb="1.5rem"
        spacing="0.75rem"
        align="flex-start"
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
          reviewRequestedTime={new Date()}
        />
      </VStack>
      <Box pl="9.25rem" pr="2rem">
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
      mainButtonText={isApproved ? "Approved" : "Pending Review"}
      variant="solid"
    >
      <MenuDropdownItem onClick={() => setIsApproved(false)}>
        <Text textStyle="body-1" textColor="text.body" w="100%">
          Pending review
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
  const { date, time } = getDateTimeFromUnixTime(
    reviewRequestedTime.getTime() / 1000
  )
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
          {reviewers.map((name) => {
            const initials = extractInitials(name)
            return (
              <Avatar
                border="1px solid white"
                mr="-0.25rem"
                bg="primary.100"
                name={initials}
                textStyle="caption-1"
                textColor="primary.400"
                size="sm"
              />
            )
          })}
        </Box>
      </HStack>
    </VStack>
  )
}
