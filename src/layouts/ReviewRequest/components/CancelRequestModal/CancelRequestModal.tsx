import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

import { useCancelReviewRequest } from "hooks/reviewHooks/useCancelReviewRequest"

import { getAxiosErrorMessage } from "utils/axios"

import { useErrorToast } from "utils"

export const CancelRequestModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { onClose } = props
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const prNumber = parseInt(reviewId, 10)
  const {
    mutateAsync: cancelReviewRequest,
    isLoading,
    isError,
    error,
  } = useCancelReviewRequest(siteName, prNumber)
  const errorToast = useErrorToast()

  useEffect(() => {
    if (isError) {
      errorToast({
        description: getAxiosErrorMessage(error),
      })
    }
  }, [error, errorToast, isError])

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" color="text.title.alt">
            Cancel request?
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text textStyle="body-2">
            The request to review will be cancelled but changes made will
            remain.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            textColor="text.body"
            variant="clear"
            mr="1rem"
            onClick={onClose}
          >
            Go back
          </Button>
          <Button
            isLoading={isLoading}
            colorScheme="danger"
            onClick={async () => {
              await cancelReviewRequest()
              onClose()
            }}
          >
            Yes, cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
