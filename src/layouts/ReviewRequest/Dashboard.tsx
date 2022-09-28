import { HStack, VStack, Text, Box, Avatar, Icon } from "@chakra-ui/react"
import { IconButton, Button } from "@opengovsg/design-system-react"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { useState } from "react"
import { BiLink } from "react-icons/bi"

import { extractInitials, getDateTimeFromUnixTime } from "utils"

const useGetPullRequest = (siteName: string) => {
  return {
    title: "Update STCCED hyperlink, customs duty",
    requestor: "seaerchin",
    reviewers: ["nat mae tan", "jiachin er"],
  }
}

export interface ReviewRequestDashboardProps {
  siteName: string
}
export const ReviewRequestDashboard = ({
  siteName,
}: ReviewRequestDashboardProps): JSX.Element => {
  const { title, requestor, reviewers } = useGetPullRequest(siteName)
  return (
    <VStack
      bg="blue.50"
      pl="9.25rem"
      pr="2rem"
      pt="2rem"
      pb="1.5rem"
      spacing="0.75rem"
      align="flex-start"
    >
      <HStack spacing="2rem">
        <HStack spacing="0.25rem">
          <Text textStyle="h5">{title}</Text>
          <IconButton
            icon={<BiLink />}
            variant="clear"
            aria-label="link to pull request"
          />
        </HStack>
        <ApprovalButton />
      </HStack>
      <SecondaryDetails
        requestor={requestor}
        reviewers={reviewers}
        reviewRequestedTime={new Date()}
      />
    </VStack>
  )
}

// NOTE: Utility component exists to soothe over state management of colours
const ApprovalButton = (): JSX.Element => {
  const [isApproved, setIsApproved] = useState(false)
  const bgColour = isApproved
    ? "background.action.success"
    : "background.action.default"

  return (
    <MenuDropdownButton
      bg={bgColour}
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
