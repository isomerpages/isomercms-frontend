import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Center,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { CollaboratorModalContext } from "components/CollaboratorModal/CollaboratorModalContext"
import {
  ACK_REQUIRED_ERROR_MESSAGE,
  CollaboratorModalState,
} from "components/CollaboratorModal/constants"
import {
  AcknowledgementSubmodal,
  MainSubmodal,
  RemoveCollaboratorSubmodal,
} from "components/CollaboratorModal/submodals"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import * as CollaboratorHooks from "hooks/collaboratorHooks"

import { useSuccessToast } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const CollaboratorModal = ({
  siteName,
}: {
  siteName: string
}): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const successToast = useSuccessToast()

  const [deleteCollaboratorTarget, setDeleteCollaboratorTarget] = useState(
    undefined
  )
  const [modalState, setModalState] = useState<CollaboratorModalState>(
    CollaboratorModalState.Default
  )

  const collaboratorFormMethods = useForm({
    mode: "onTouched",
    defaultValues: {
      newCollaboratorEmail: "",
      isAcknowledged: false,
    },
  })

  // Set up hooks
  const {
    mutateAsync: addCollaborator,
    error: addCollaboratorError,
    isSuccess: addCollaboratorSuccess,
  } = CollaboratorHooks.useAddCollaboratorHook(siteName)

  const { data: collaboratorData } = CollaboratorHooks.useListCollaboratorsHook(
    siteName
  )

  const {
    data: collaboratorRoleData,
  } = CollaboratorHooks.useGetCollaboratorRoleHook(siteName)

  const renderModalContent = (currModalState: CollaboratorModalState) => {
    switch (currModalState) {
      case CollaboratorModalState.Acknowledgement:
        return <AcknowledgementSubmodal />
      case CollaboratorModalState.Default:
        return (
          <MainSubmodal
            addCollaboratorError={addCollaboratorError?.response?.data?.error}
          />
        )
      case CollaboratorModalState.RemoveCollaborator:
        return <RemoveCollaboratorSubmodal siteName={siteName} />

      default: {
        const error: never = currModalState
        throw new Error(
          `${error} encountered! Non-exhaustive switch case for modal state`
        )
      }
    }
  }

  // Show acknowledgement modal if user does not have a trusted email
  useEffect(() => {
    // No error message implies no error
    if (!addCollaboratorError?.response?.data?.error) return

    const { message: errMessage } = addCollaboratorError?.response?.data?.error

    if (errMessage === ACK_REQUIRED_ERROR_MESSAGE) {
      setModalState(CollaboratorModalState.Acknowledgement)
    }
  }, [addCollaboratorError])

  useEffect(() => {
    if (addCollaboratorSuccess) {
      successToast({ description: "Collaborator added successfully" })
      setModalState(CollaboratorModalState.Default)
    }
  }, [addCollaboratorSuccess, successToast])

  return (
    <>
      <Center m="36px">
        <Button onClick={onOpen}>Manage site collaborators</Button>
      </Center>
      <CollaboratorModalContext.Provider
        value={{
          setModalState,
          collaboratorData,
          collaboratorRoleData,
          deleteCollaboratorTarget,
          setDeleteCollaboratorTarget,
        }}
      >
        <Modal
          isOpen={isOpen}
          onClose={() => {
            collaboratorFormMethods.reset()
            setModalState(CollaboratorModalState.Default)
            setDeleteCollaboratorTarget(undefined)
            onClose()
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <FormProvider {...collaboratorFormMethods}>
              <form
                onSubmit={collaboratorFormMethods.handleSubmit(async (data) => {
                  await addCollaborator(data)
                })}
              >
                {renderModalContent(modalState)}
              </form>
            </FormProvider>
            <ModalFooter p="22px" />
          </ModalContent>
        </Modal>
      </CollaboratorModalContext.Provider>
    </>
  )
}
