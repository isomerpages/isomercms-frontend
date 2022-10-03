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
import { CollaboratorModalState } from "components/CollaboratorModal/constants"
import {
  AcknowledgementSubmodal,
  MainSubmodal,
  RemoveCollaboratorSubmodal,
} from "components/CollaboratorModal/submodals"
import PropTypes from "prop-types"
import { useState } from "react"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import * as CollaboratorHooks from "hooks/collaboratorHooks"
import { useLocalStorage } from "hooks/useLocalStorage"

// eslint-disable-next-line import/prefer-default-export
export const CollaboratorModal = ({ siteName }: { siteName: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [localUser] = useLocalStorage(LOCAL_STORAGE_KEYS.User, { email: "" })

  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("")
  const [addCollaboratorError, setAddCollaboratorError] = useState("")
  const [deleteCollaboratorTarget, setDeleteCollaboratorTarget] = useState(
    undefined
  )
  const [modalState, setModalState] = useState<CollaboratorModalState>(
    CollaboratorModalState.Default
  )
  const [isAcknowledged, setIsAcknowledged] = useState(false)

  // Set up hooks
  const { data: collaboratorData } = CollaboratorHooks.useListCollaboratorsHook(
    siteName
  )

  const {
    data: collaboratorRoleData,
  } = CollaboratorHooks.useGetCollaboratorRoleHook(siteName)

  const {
    mutateAsync: addCollaborator,
  } = CollaboratorHooks.useAddCollaboratorHook(
    siteName,
    setAddCollaboratorError,
    setModalState,
    isAcknowledged,
    setIsAcknowledged
  )

  const {
    mutateAsync: deleteCollaborator,
  } = CollaboratorHooks.useDeleteCollaboratorHook(siteName)

  // Handlers
  const handleAddCollaborator = async () => {
    addCollaborator(newCollaboratorEmail)
  }
  const handleDeleteCollaborator = async (collaboratorId: string) => {
    deleteCollaborator(collaboratorId)
  }

  const renderModalContent = (currModalState: CollaboratorModalState) => {
    switch (currModalState) {
      case CollaboratorModalState.Acknowledgement:
        return <AcknowledgementSubmodal />
      case CollaboratorModalState.Default:
        return <MainSubmodal />
      case CollaboratorModalState.RemoveCollaborator:
        return <RemoveCollaboratorSubmodal />

      default:
        return <MainSubmodal />
    }
  }

  return (
    <>
      <Center m="36px">
        <Button onClick={onOpen}>Manage site collaborators</Button>
      </Center>
      <CollaboratorModalContext.Provider
        value={{
          newCollaboratorEmail,
          setNewCollaboratorEmail,
          addCollaboratorError,
          setAddCollaboratorError,
          modalState,
          setModalState,
          isAcknowledged,
          setIsAcknowledged,
          collaboratorData,
          collaboratorRoleData,
          addCollaborator,
          deleteCollaborator,
          handleAddCollaborator,
          handleDeleteCollaborator,
          isModalOpen: isOpen,
          closeModal: onClose,
          localUser,
          deleteCollaboratorTarget,
          setDeleteCollaboratorTarget,
        }}
      >
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setAddCollaboratorError("")
            setModalState(CollaboratorModalState.Default)
            setDeleteCollaboratorTarget(undefined)
            onClose()
          }}
        >
          <ModalOverlay />
          <ModalContent>
            {renderModalContent(modalState)}
            <ModalFooter p="22px" />
          </ModalContent>
        </Modal>
      </CollaboratorModalContext.Provider>
    </>
  )
}

CollaboratorModal.propTypes = {
  siteName: PropTypes.string.isRequired,
}
