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
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import Select from "react-select"

import { useReviewRequestRoleContext } from "contexts/ReviewRequestRoleContext"

import { useUpdateReviewRequest } from "hooks/reviewHooks/useUpdateReviewRequest"

import { getAxiosErrorMessage } from "utils/axios"

import { User } from "types/reviewRequest"
import { useErrorToast, useSuccessToast } from "utils"

export interface ManageReviewerModalProps extends Omit<ModalProps, "children"> {
  selectedAdmins: User[]
  admins: User[]
}

export const ManageReviewerModal = ({
  selectedAdmins,
  admins,
  ...props
}: ManageReviewerModalProps): JSX.Element => {
  const { onClose } = props
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const prNumber = parseInt(reviewId, 10)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const { role } = useReviewRequestRoleContext()

  const {
    mutateAsync: updateReviewRequest,
    isLoading: isUpdateReviewRequestLoading,
    isError: isUpdateReviewRequestError,
    error: updateReviewRequestError,
    isSuccess: isUpdateReviewRequestSuccess,
  } = useUpdateReviewRequest(siteName, prNumber)

  const methods = useForm<{ reviewers: User[] }>()

  const onSubmit = methods.handleSubmit(async (data) => {
    await updateReviewRequest(data)
    onClose()
  })

  useEffect(() => {
    if (isUpdateReviewRequestSuccess) {
      successToast({
        id: "update-review-request-success",
        description: "Your review request has been updated!",
      })
    }
  }, [isUpdateReviewRequestSuccess, successToast])

  useEffect(() => {
    if (isUpdateReviewRequestError) {
      errorToast({
        id: "update-review-request-error",
        description: getAxiosErrorMessage(updateReviewRequestError),
      })
    }
  }, [errorToast, isUpdateReviewRequestError, updateReviewRequestError])

  return (
    <Modal motionPreset="none" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" color="text.title.alt">
            Manage Reviewers
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <VStack spacing="0.75rem" align="flex-start">
                <Text textStyle="subhead-1">
                  Add or remove Admins who can approve this request
                </Text>
                <AdminsMultiSelect
                  admins={admins}
                  selectedAdmins={selectedAdmins}
                />
              </VStack>
            </form>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button variant="clear" mr="1rem" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isUpdateReviewRequestLoading}
            isDisabled={role !== "requestor"}
            type="submit"
            onClick={onSubmit}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const AdminsMultiSelect = ({
  admins,
  selectedAdmins,
}: Pick<ManageReviewerModalProps, "admins" | "selectedAdmins">) => {
  return (
    <Controller
      name="reviewers"
      defaultValue={selectedAdmins}
      render={({ field }) => (
        <Select
          {...field}
          isMulti
          isClearable={false}
          options={admins}
          components={{
            Input: () => {
              const updatedSelectedAdmins = field.value ?? []
              const remainingAdmins = _.difference(
                admins,
                updatedSelectedAdmins
              )
              return remainingAdmins.length > 1 ? (
                <Text
                  ml="0.25rem"
                  textDecoration="underline"
                  color="text.link.default"
                  textStyle="body-2"
                >{`+${remainingAdmins.length - 1} more`}</Text>
              ) : null
            },
          }}
          styles={{
            // NOTE: Setting minimum height so that it is same size as button
            container: (base) => ({
              ...base,
              width: "100%",
              minHeight: "2.75rem",
            }),
            control: (base) => ({ ...base, height: "100%" }),
            // NOTE: Don't allow removal if there is only 1 selected admin
            multiValueRemove: (base) => {
              const canRemove = field.value?.length > 1
              return { ...base, display: canRemove ? "inherit" : "none" }
            },
          }}
        />
      )}
    />
  )
}
