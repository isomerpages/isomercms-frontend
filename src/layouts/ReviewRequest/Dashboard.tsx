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
  useDisclosure,
} from "@chakra-ui/react"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { useEffect, useState } from "react"
import { BiLink, BiPlus } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { useGetReviewRequest } from "hooks/reviewHooks/useGetReviewRequest"
import useRedirectHook from "hooks/useRedirectHook"

import { ReviewRequestStatus } from "types/reviewRequest"
import { extractInitials, getDateTimeFromUnixTime } from "utils"

import { SiteViewHeader } from "../layouts/SiteViewLayout/SiteViewHeader"

import { ManageReviewerModal } from "./components"
import { ApprovedModal } from "./components/ApprovedModal"
import { RequestOverview } from "./components/RequestOverview"

export const ReviewRequestDashboard = (): JSX.Element => {
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { setRedirectToPage } = useRedirectHook()
  // TODO!: Refactor so that loading is not a concern here
  const { data } = useGetReviewRequest(siteName, parseInt(reviewId, 10))

  // TODO!: redirect to /sites if cannot parse reviewId as string
  // this happens when the review is published or requestor closes it
  const { onCopy, hasCopied } = useClipboard(data?.reviewUrl || "")

  const reviewStatus = data?.status

  useEffect(() => {
    if (
      reviewStatus === ReviewRequestStatus.CLOSED ||
      reviewStatus === ReviewRequestStatus.MERGED
    ) {
      setRedirectToPage(`/sites/${siteName}/dashboard`)
    }
  }, [reviewStatus, setRedirectToPage, siteName])

  return (
    <>
      <SiteViewHeader />
      <Box bg="white" w="100%" h="100vh">
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
              <Text textStyle="h5">{data?.title || ""}</Text>
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
            requestor={data?.requestor || ""}
            reviewers={data?.reviewers || []}
            reviewRequestedTime={
              data?.reviewRequestedTime
                ? new Date(data?.reviewRequestedTime)
                : new Date()
            }
          />
        </VStack>
        <Box pl="9.25rem" pr="2rem">
          <RequestOverview items={data?.changedItems || []} allowEditing />
        </Box>
      </Box>
    </>
  )
}

// NOTE: Utility component exists to soothe over state management
const ApprovalButton = (): JSX.Element => {
  const [isApproved, setIsApproved] = useState(false)
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
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
        <MenuDropdownItem
          onClick={() => {
            setIsApproved(true)
            onOpen()
          }}
        >
          <Text textStyle="body-1" textColor="text.success" w="100%">
            Approved
          </Text>
        </MenuDropdownItem>
      </MenuDropdownButton>
      <ApprovedModal isOpen={isOpen} onClose={onClose} />
    </>
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
  const props = useDisclosure()
  const selectedAdmins = reviewers.map((reviewer) => {
    return {
      value: reviewer,
      label: reviewer,
    }
  })

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
            onClick={props.onOpen}
          />
          <ManageReviewerModal
            {...props}
            selectedAdmins={selectedAdmins}
            // TODO!
            admins={[]}
          />
        </Box>
      </HStack>
    </VStack>
  )
}
