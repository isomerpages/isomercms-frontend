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

import { useRoleContext } from "contexts/RoleContext"

import { useApproveReviewRequest } from "hooks/reviewHooks/useApproveReviewRequest"
import { useGetCollaborators } from "hooks/reviewHooks/useGetCollaborators"
import { useGetReviewRequest } from "hooks/reviewHooks/useGetReviewRequest"
import { useMergeReviewRequest } from "hooks/reviewHooks/useMergeReviewRequest"
import useRedirectHook from "hooks/useRedirectHook"

import { getAxiosErrorMessage } from "utils/axios"

import { ReviewRequestStatus } from "types/reviewRequest"
import { extractInitials, getDateTimeFromUnixTime, useErrorToast } from "utils"

import { SiteViewHeader } from "../layouts/SiteViewLayout/SiteViewHeader"

import { CancelRequestModal, ManageReviewerModal } from "./components"
import { ApprovedModal } from "./components/ApprovedModal"
import { PublishedModal } from "./components/PublishedModal"
import { RequestOverview } from "./components/RequestOverview"

export const ReviewRequestDashboard = (): JSX.Element => {
  const { role } = useRoleContext()
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { setRedirectToPage } = useRedirectHook()
  // TODO!: Refactor so that loading is not a concern here
  const { data, isLoading: isGetReviewRequestLoading } = useGetReviewRequest(
    siteName,
    parseInt(reviewId, 10)
  )
  const { data: collaborators, isLoading, isError } = useGetCollaborators(
    siteName
  )
  // TODO!: redirect to /sites if cannot parse reviewId as string
  const { onCopy, hasCopied } = useClipboard(data?.reviewUrl || "")

  const reviewStatus = data?.status
  const isApproved = reviewStatus === ReviewRequestStatus.APPROVED

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
            {role === "requestor" ? (
              <CancelRequestButton isApproved={isApproved} />
            ) : (
              <ApprovalButton />
            )}
          </Flex>
          <SecondaryDetails
            requestor={data?.requestor || ""}
            reviewers={data?.reviewers || []}
            reviewRequestedTime={
              data?.reviewRequestedTime
                ? new Date(data?.reviewRequestedTime)
                : new Date()
            }
            admins={
              collaborators
                ?.filter((user) => user.role === "ADMIN")
                .map(({ email }) => email) || []
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

interface CancelRequestButtonProps {
  isApproved: boolean
}

const CancelRequestButton = ({
  isApproved,
}: CancelRequestButtonProps): JSX.Element => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { role, isLoading } = useRoleContext()
  const buttonText = isApproved ? "Approved" : "In review"

  return (
    <>
      <MenuDropdownButton
        colorScheme={isApproved ? "success" : "primary"}
        mainButtonText={buttonText}
        variant="solid"
        isLoading={isLoading}
        isDisabled={role !== "requestor"}
      >
        <MenuDropdownItem onClick={onOpen}>
          <Text textStyle="body-1" textColor="text.danger" w="100%">
            Cancel request
          </Text>
        </MenuDropdownItem>
      </MenuDropdownButton>
      <CancelRequestModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

// NOTE: Utility component exists to soothe over state management
const ApprovalButton = (): JSX.Element => {
  const [isApproved, setIsApproved] = useState(false)
  const { role, isLoading } = useRoleContext()
  const { onOpen, isOpen, onClose } = useDisclosure()
  const errorToast = useErrorToast()
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const prNumber = parseInt(reviewId, 10)
  const {
    mutateAsync: mergeReviewRequest,
    isLoading: isMergingReviewRequest,
    isSuccess: isReviewRequestMerged,
    // TODO!
    isError: isMergeError,
  } = useMergeReviewRequest(siteName, prNumber, false)
  // TODO! make be change the status to approved
  const {
    mutateAsync: approveReviewRequest,
    isError,
    error,
  } = useApproveReviewRequest(siteName, prNumber)

  useEffect(() => {
    if (isError) {
      errorToast({
        description: getAxiosErrorMessage(error),
      })
    }
  }, [error, errorToast, isError])

  return (
    <>
      <MenuDropdownButton
        colorScheme={isApproved ? "success" : "primary"}
        mainButtonText={isApproved ? "Approved" : "In review"}
        variant="solid"
        isDisabled={role !== "reviewer"}
        isLoading={isLoading}
      >
        <MenuDropdownItem onClick={() => setIsApproved(false)}>
          <Text textStyle="body-1" textColor="text.body" w="100%">
            In review
          </Text>
        </MenuDropdownItem>
        <MenuDropdownItem
          onClick={async () => {
            await approveReviewRequest()
            setIsApproved(true)
            onOpen()
          }}
        >
          <Text textStyle="body-1" textColor="text.success" w="100%">
            Approved
          </Text>
        </MenuDropdownItem>
      </MenuDropdownButton>
      {isReviewRequestMerged ? (
        <PublishedModal isOpen={isOpen} onClose={onClose} />
      ) : (
        <ApprovedModal
          isOpen={isOpen}
          onClose={onClose}
          onClick={mergeReviewRequest}
          isLoading={isMergingReviewRequest}
        />
      )}
    </>
  )
}

interface SecondaryDetailsProps {
  requestor: string
  reviewers: string[]
  reviewRequestedTime: Date
  admins: string[]
}
const SecondaryDetails = ({
  requestor,
  reviewers,
  reviewRequestedTime,
  admins,
}: SecondaryDetailsProps) => {
  const { date, time } = getDateTimeFromUnixTime(reviewRequestedTime.getTime())
  const props = useDisclosure()
  const selectedAdmins = reviewers.map((reviewer) => {
    return {
      value: reviewer,
      label: reviewer,
    }
  })
  const allAdmins = admins
    .filter((admin) => admin !== requestor)
    .map((admin) => ({
      value: admin,
      label: admin,
    }))

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
            admins={allAdmins}
          />
        </Box>
      </HStack>
    </VStack>
  )
}
