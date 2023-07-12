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
  Skeleton,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Footer } from "components/Footer"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { useEffect, useState } from "react"
import { BiLink, BiPlus } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { useReviewRequestRoleContext } from "contexts/ReviewRequestRoleContext"

import { useListCollaborators } from "hooks/collaboratorHooks"
import { useUnapproveReviewRequest } from "hooks/reviewHooks"
import { useApproveReviewRequest } from "hooks/reviewHooks/useApproveReviewRequest"
import { useGetReviewRequest } from "hooks/reviewHooks/useGetReviewRequest"
import { useMergeReviewRequest } from "hooks/reviewHooks/useMergeReviewRequest"
import { useUpdateReviewRequestViewed } from "hooks/reviewHooks/useUpdateReviewRequestViewed"
import useRedirectHook from "hooks/useRedirectHook"

import { SiteViewHeader } from "layouts/layouts/SiteViewLayout/SiteViewHeader"

import { getAxiosErrorMessage } from "utils/axios"

import { ReviewRequestStatus } from "types/reviewRequest"
import { extractInitials, getDateTimeFromUnixTime, useErrorToast } from "utils"

import { CancelRequestModal, ManageReviewerModal } from "./components"
import { ApprovedModal } from "./components/ApprovedModal"
import { CommentsDrawer } from "./components/Comments/CommentsDrawer"
import { PublishedModal } from "./components/PublishedModal"
import { RequestOverview } from "./components/RequestOverview"

export const ReviewRequestDashboard = (): JSX.Element => {
  const { role } = useReviewRequestRoleContext()
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { setRedirectToPage } = useRedirectHook()
  const { onOpen, isOpen, onClose } = useDisclosure()
  // TODO!: redirect to /sites if cannot parse reviewId as string
  const prNumber = parseInt(reviewId, 10)
  const { data, isLoading: isGetReviewRequestLoading } = useGetReviewRequest(
    siteName,
    prNumber
  )
  const { data: collaborators, isLoading, isError } = useListCollaborators(
    siteName
  )
  const {
    mutateAsync: updateReviewRequestViewed,
  } = useUpdateReviewRequestViewed()
  const {
    mutateAsync: mergeReviewRequest,
    isLoading: isMergingReviewRequest,
    isSuccess: isReviewRequestMerged,
    // TODO!
    isError: isMergeError,
  } = useMergeReviewRequest(siteName, prNumber, false)
  const [isApproved, setIsApproved] = useState<boolean | null>(null)

  const { onCopy, hasCopied } = useClipboard(data?.reviewUrl || "")
  const reviewStatus = data?.status
  const hasInvalidReviewRequest =
    reviewStatus === ReviewRequestStatus.CLOSED ||
    reviewStatus === ReviewRequestStatus.MERGED

  useEffect(() => {
    if (hasInvalidReviewRequest) {
      setRedirectToPage(`/sites/${siteName}/dashboard`)
    }
    if (reviewStatus && isApproved === null) {
      setIsApproved(reviewStatus === ReviewRequestStatus.APPROVED)
    }
  }, [
    isApproved,
    hasInvalidReviewRequest,
    reviewStatus,
    setRedirectToPage,
    siteName,
  ])

  useEffect(() => {
    updateReviewRequestViewed({ siteName, prNumber })
  }, [prNumber, siteName, updateReviewRequestViewed])

  return (
    <>
      <SiteViewHeader />
      <Box bg="white" w="100%" minH="100vh">
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
                <Skeleton
                  isLoaded={!isGetReviewRequestLoading}
                  minW="10rem"
                  minH="1rem"
                >
                  <Text textStyle="h5">{data?.title}</Text>
                </Skeleton>
                {/* Closes after 1.5s and does not refocus on the button to avoid the outline */}
                <Popover returnFocusOnClose={false} isOpen={hasCopied}>
                  <PopoverTrigger>
                    <IconButton
                      icon={<BiLink />}
                      variant="clear"
                      aria-label="link to pull request"
                      onClick={onCopy}
                      isLoading={isGetReviewRequestLoading}
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
                <CancelRequestButton
                  isApproved={isApproved}
                  setIsApproved={setIsApproved}
                />
              ) : (
                <ApprovalButton
                  isApproved={isApproved}
                  setIsApproved={setIsApproved}
                />
              )}
            </Flex>
            <Skeleton
              isLoaded={
                !!(
                  data?.requestor &&
                  data?.reviewers &&
                  data?.reviewRequestedTime
                )
              }
            >
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
            </Skeleton>
          </VStack>
          <Flex h="100%" w="7.25rem" pt="2rem" justifyContent="end">
            {/* TODO: swap this to a slide out component and not a drawer */}
            <CommentsDrawer
              isDisabled={hasInvalidReviewRequest}
              siteName={siteName}
              requestId={prNumber}
            />
          </Flex>
        </HStack>
        <Box pl="9.25rem" pr="2rem">
          <Skeleton isLoaded={!isGetReviewRequestLoading}>
            <RequestOverview items={data?.changedItems || []} allowEditing />
          </Skeleton>
        </Box>
        {isApproved && (
          <Footer>
            <Button
              onClick={async () => {
                await mergeReviewRequest()
                onOpen()
              }}
              isLoading={isMergingReviewRequest}
            >
              Publish now
            </Button>
          </Footer>
        )}
        {isReviewRequestMerged && (
          <PublishedModal isOpen={isOpen} onClose={onClose} />
        )}
      </Box>
    </>
  )
}

interface RequestButtonProps {
  isApproved: null | boolean
  setIsApproved: (state: boolean) => void
}

const CancelRequestButton = ({
  isApproved,
  setIsApproved,
}: RequestButtonProps): JSX.Element => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { role, isLoading } = useReviewRequestRoleContext()
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
      <CancelRequestModal
        isOpen={isOpen}
        onClose={() => {
          setIsApproved(false)
          onClose()
        }}
      />
    </>
  )
}

const ApprovalButton = ({
  isApproved,
  setIsApproved,
}: RequestButtonProps): JSX.Element => {
  const { role, isLoading } = useReviewRequestRoleContext()
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
    // TODO! - display error toast on merge failure
    isError: isMergeError,
  } = useMergeReviewRequest(siteName, prNumber, false)
  const {
    mutateAsync: approveReviewRequest,
    isError: isApproveReviewRequestError,
    error: approveReviewRequestError,
  } = useApproveReviewRequest(siteName, prNumber)

  const {
    mutateAsync: unapproveReviewRequest,
    isError: isUnapproveReviewRequestError,
    error: unapproveReviewRequestError,
  } = useUnapproveReviewRequest(siteName, prNumber)

  useEffect(() => {
    if (isUnapproveReviewRequestError) {
      errorToast({
        id: "unapprove-review-request-error",
        description: getAxiosErrorMessage(unapproveReviewRequestError),
      })
    }
  }, [unapproveReviewRequestError, errorToast, isUnapproveReviewRequestError])

  useEffect(() => {
    if (isApproveReviewRequestError) {
      errorToast({
        id: "approve-review-request-error",
        description: getAxiosErrorMessage(approveReviewRequestError),
      })
    }
  }, [approveReviewRequestError, errorToast, isApproveReviewRequestError])

  return (
    <>
      <MenuDropdownButton
        colorScheme={isApproved ? "success" : "primary"}
        mainButtonText={isApproved ? "Approved" : "In review"}
        variant="solid"
        isDisabled={role !== "reviewer"}
        isLoading={isLoading}
      >
        <MenuDropdownItem
          onClick={async () => {
            setIsApproved(false)
            await unapproveReviewRequest()
          }}
        >
          <Text textStyle="body-1" textColor="text.body" w="100%">
            In review
          </Text>
        </MenuDropdownItem>
        <MenuDropdownItem
          onClick={async () => {
            setIsApproved(true)
            await approveReviewRequest()
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
  const { role } = useReviewRequestRoleContext()
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
            isDisabled={role !== "requestor"}
            onClick={props.onOpen}
          />
          <ManageReviewerModal
            {...props}
            selectedAdmins={selectedAdmins}
            admins={allAdmins}
          />
        </Box>
      </HStack>
    </VStack>
  )
}
