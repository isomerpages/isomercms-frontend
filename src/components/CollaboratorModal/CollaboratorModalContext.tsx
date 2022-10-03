import { CollaboratorModalState } from "components/CollaboratorModal/constants"
import { createContext, useContext } from "react"
import type { Dispatch, SetStateAction } from "react"

interface CollaboratorModalProps {
  newCollaboratorEmail: string
  setNewCollaboratorEmail: Dispatch<SetStateAction<string>>
  addCollaboratorError: string
  setAddCollaboratorError: Dispatch<SetStateAction<string>>
  modalState: CollaboratorModalState
  setModalState: Dispatch<SetStateAction<CollaboratorModalState>>
  isAcknowledged: boolean
  setIsAcknowledged: Dispatch<SetStateAction<boolean>>
  collaboratorData: any // TODO
  collaboratorRoleData: { role: string } // TODO
  addCollaborator: any // TODO
  deleteCollaborator: any // TODO
  handleAddCollaborator: any // TODO
  handleDeleteCollaborator: any // TODO
  isModalOpen: boolean
  closeModal: () => void
  localUser: any // TODO
  deleteCollaboratorTarget: any // TODO
  setDeleteCollaboratorTarget: Dispatch<SetStateAction<any>> // TODO
}
const CollaboratorModalContext = createContext<
  CollaboratorModalProps | undefined
>(undefined)

const useCollaboratorModalContext = () => {
  const collaboratorModalContext = useContext(CollaboratorModalContext)
  if (!collaboratorModalContext) {
    throw new Error(
      "useCollaboratorModalContext must be called within a CollaboratorModalContext!"
    )
  }
  return collaboratorModalContext
}

export { CollaboratorModalContext, useCollaboratorModalContext }
