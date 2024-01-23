import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
  Heading,
} from "@chakra-ui/react"
import { Button, ModalCloseButton, Tab } from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { useListCollaborators } from "hooks/collaboratorHooks"
import { useCreateReviewRequest } from "hooks/reviewHooks/useCreateReviewRequest"
import { useDiff } from "hooks/reviewHooks/useDiff"

import { useSuccessToast } from "utils/toasts"

import { ReviewRequestInfo } from "types/reviewRequest"
import { useErrorToast } from "utils"

import { RequestOverview } from "../RequestOverview"
import { ReviewRequestForm } from "../ReviewRequestForm"

export const ReviewRequestModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { email: adminEmail } = useLoginContext()
  const errorToast = useErrorToast()
  const successToast = useSuccessToast()

  const { onClose, isOpen } = props
  const { siteName } = useParams<{ siteName: string }>()
  const { data: items, refetch } = useDiff(siteName)
  const { data: collaborators } = useListCollaborators(siteName)
  const {
    mutateAsync: createReviewRequest,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useCreateReviewRequest(siteName)

  const methods = useForm<Required<ReviewRequestInfo>>({
    mode: "onTouched",
  })
  const onSubmit = methods.handleSubmit(async (data) => {
    await createReviewRequest(data)
    onClose()
  })

  useEffect(() => {
    if (isOpen) refetch()
  }, [refetch, isOpen])
  // Trigger an error toast informing the user
  // if review request not created
  useEffect(() => {
    if (isError) {
      const errorMessage =
        error.response?.data.message || "Review request could not be created!"
      errorToast({
        id: "review-request-create-error",
        description: errorMessage,
      })
    }
  }, [error, errorToast, isError])

  // Trigger a success toast informing the user if review created successfully
  useEffect(() => {
    if (isSuccess) {
      successToast({
        id: "review-request-create-success",
        description: "Review request submitted",
      })
    }
  }, [isSuccess, successToast])

  const selectedReviewers = methods.watch("reviewers")

  return (
    <Modal {...props} size="full" motionPreset="none">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          {/*
          NOTE: padding has to be used as the base component from Chakra uses it to set padding.
          Not using it (and using pt etc) would result in the property being overwritten to the default.
          The format is top, left + right, bottom.
          */}
          <ModalHeader bg="blue.50" padding="6rem 16.5rem 1.5rem">
            <VStack spacing="0.625rem" align="flex-start">
              <Heading as="h4" textStyle="h4" color="text.title.alt">
                Request a review
              </Heading>
              <Text textStyle="body-2" color="text.helper">
                An Admin needs to review and approve your changes before they
                can be published
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="16.5rem" pt="1.5rem" pb="2.5rem">
            <Tabs>
              <TabList>
                {/*
                NOTE: The design system tab has inbuilt left-margin.
                However, the figma design requires that the tabs be aligned with the content.
                Hence, margin is set to 0 here
                */}
                <Tab ml={0}>Add Details</Tab>
                <Tab>Edited Items</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <FormProvider {...methods}>
                    <ReviewRequestForm
                      admins={
                        collaborators
                          ?.filter(
                            ({ role, email: collaboratorEmail }) =>
                              role === "ADMIN" &&
                              collaboratorEmail !== adminEmail
                          )
                          .map(({ email }) => ({
                            value: email,
                            label: email,
                          })) || []
                      }
                    />
                  </FormProvider>
                </TabPanel>
                <TabPanel>
                  <RequestOverview items={items || []} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <Divider bg="border.divider.alt" />
          <ModalFooter>
            <Button variant="clear" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              type="submit"
              // NOTE: Disallow creation if no item changed
              // as GitHub will prevent PR creation.
              // We also disallow creation if no admins are selected.
              isDisabled={
                !items ||
                items.length === 0 ||
                !selectedReviewers ||
                selectedReviewers.length === 0
              }
            >
              Submit Review
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
