import { ModalProps } from "@chakra-ui/react"
import {
  MainSubmodal,
  RemoveCollaboratorSubmodal,
} from "components/CollaboratorModal/components"
import { useState } from "react"

import { useLoginContext } from "contexts/LoginContext"

import useRedirectHook from "hooks/useRedirectHook"

import { Collaborator } from "types/collaborators"

// eslint-disable-next-line import/prefer-default-export
export const CollaboratorModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const [deleteCollaboratorTarget, setDeleteCollaboratorTarget] = useState<
    Collaborator | undefined
  >(undefined)
  const [showDelete, setShowDelete] = useState(false)
  const { email } = useLoginContext()
  const isUserDeletingThemselves = email === deleteCollaboratorTarget?.email
  const { setRedirectToPage } = useRedirectHook()

  return showDelete && deleteCollaboratorTarget ? (
    <RemoveCollaboratorSubmodal
      {...props}
      userToDelete={deleteCollaboratorTarget}
      onDeleteComplete={() => {
        setShowDelete(false)
        if (isUserDeletingThemselves) {
          setRedirectToPage(`/sites`)
        }
      }}
    />
  ) : (
    <MainSubmodal
      {...props}
      onDelete={(user) => {
        setShowDelete(true)
        setDeleteCollaboratorTarget(user)
      }}
    />
  )
}
