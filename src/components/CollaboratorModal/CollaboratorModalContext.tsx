import { CollaboratorModalState } from "components/CollaboratorModal/constants"
import { createContext, useContext, Dispatch, SetStateAction } from "react"

interface CollaboratorModalProps {
  setModalState: (state: CollaboratorModalState) => void
  collaboratorData: any // TODO
  collaboratorRoleData: { role: string } // TODO
  deleteCollaboratorTarget: any // TODO
  setDeleteCollaboratorTarget: Dispatch<SetStateAction<any>> // TODO
}

const CollaboratorModalContext = createContext<
  CollaboratorModalProps | undefined
>(undefined)

const useCollaboratorModalContext = (): CollaboratorModalProps => {
  const collaboratorModalContext = useContext(CollaboratorModalContext)
  if (!collaboratorModalContext) {
    throw new Error(
      "useCollaboratorModalContext must be called within a CollaboratorModalContext!"
    )
  }
  return collaboratorModalContext
}

export { CollaboratorModalContext, useCollaboratorModalContext }
