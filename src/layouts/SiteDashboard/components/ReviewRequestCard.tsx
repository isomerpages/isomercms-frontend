import { Icon, Badge, Box, HStack, Text } from "@chakra-ui/react"
import { InlineMessage } from "@opengovsg/design-system-react"
import {
  DisplayCard,
  DisplayCardCaption,
  DisplayCardContent,
  DisplayCardFooter,
  DisplayCardHeader,
  DisplayCardTitle,
} from "components/DisplayCard"
import { BiRightArrowAlt } from "react-icons/bi"
import { Link, useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import {
  ReviewRequestStatus,
  SiteDashboardReviewRequest,
} from "types/sitedashboard"

export const ReviewRequestCard = ({
  reviewRequest,
}: {
  reviewRequest: SiteDashboardReviewRequest
}): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { userId } = useLoginContext()

  return (
    <DisplayCard
      variant="headerAndContent"
      bgColor={
        reviewRequest.firstView
          ? "background.action.infoInverse"
          : "background.action.defaultInverse"
      }
    >
      {reviewRequest.status === ReviewRequestStatus.PENDING &&
        // TODO: To check the logged in user's email address instead
        reviewRequest.author !== userId && (
          <Badge
            variant="solid"
            textColor="text.body"
            bgColor="background.action.warning"
          >
            Review required
          </Badge>
        )}
      {reviewRequest.status === ReviewRequestStatus.APPROVED && (
        <>
          <Box paddingBottom="0.5rem">
            <InlineMessage variant="info" textStyle="body-2">
              This request is ready to be published! Publish now to unlock
              editing for the rest of your site.
            </InlineMessage>
          </Box>
          <Badge
            variant="solid"
            textColor="text.inverse"
            bgColor="background.action.success"
          >
            Approved
          </Badge>
        </>
      )}
      <DisplayCardHeader>
        <DisplayCardTitle hasUnderline noOfLines={1}>
          {reviewRequest.title}
        </DisplayCardTitle>
        <DisplayCardCaption>
          #{reviewRequest.id} created by {reviewRequest.author} on{" "}
          {reviewRequest.createdAt}
        </DisplayCardCaption>
      </DisplayCardHeader>
      <DisplayCardContent>
        <Text noOfLines={3}>{reviewRequest.description}</Text>
      </DisplayCardContent>
      <DisplayCardFooter justifyContent="center" alignItems="center">
        <HStack
          as={Link}
          to={`/sites/${siteName}/review/${reviewRequest.id}`}
          color="text.title.brand"
        >
          <Text textStyle="subhead-1">
            View <b>{reviewRequest.changedFiles}</b> changed{" "}
            {reviewRequest.changedFiles === 1 ? "item" : "items"},{" "}
            <b>{reviewRequest.newComments}</b> new{" "}
            {reviewRequest.newComments === 1 ? "comment" : "comments"}
          </Text>
          <Icon as={BiRightArrowAlt} fontSize="1.5rem" />
        </HStack>
      </DisplayCardFooter>
    </DisplayCard>
  )
}
