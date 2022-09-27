import { ModalHeader, ModalBody, Text, Stack } from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import { useCollaboratorModalContext } from "components/CollaboratorModal/CollaboratorModalContext"
import { CollaboratorModalState } from "components/CollaboratorModal/constants"

import useRedirectHook from "hooks/useRedirectHook"

const RemoveCollaboratorSubmodal = () => {
  return (
    <>
      <ModalHeader>Remove collaborator?</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <RemoveCollaboratorSubmodalContent />
      </ModalBody>
    </>
  )
}
const RemoveCollaboratorSubmodalContent = () => {
  const {
    closeModal,
    setModalState,
    deleteCollaboratorTarget,
    setDeleteCollaboratorTarget,
    handleDeleteCollaborator,
    localUser,
  } = useCollaboratorModalContext()
  const { setRedirectToPage } = useRedirectHook()
  const TEXT_FONT_SIZE = "14px"

  const userIsDeletingThemselves =
    localUser.email === deleteCollaboratorTarget?.email
  return (
    <>
      {userIsDeletingThemselves ? (
        <Text>
          Once you remove yourself as a collaborator, you will no longer be able
          to make any changes to this site.
        </Text>
      ) : (
        <Text fontSize={TEXT_FONT_SIZE}>
          <Text as="span">Once you remove</Text>
          <Text color="danger.700" as="strong">
            {" "}
            {deleteCollaboratorTarget?.email}{" "}
          </Text>
          <Text as="span">
            from this site, they will no longer be able to make any changes.
          </Text>
        </Text>
      )}

      <Stack spacing={4} direction="row" justify="right" mt="36px">
        <Button
          variant="clear"
          color="secondary"
          onClick={() => {
            setModalState(CollaboratorModalState.Default)
            setDeleteCollaboratorTarget({})
            closeModal()
          }}
        >
          Cancel
        </Button>
        <Button
          colorScheme="danger"
          onClick={() => {
            if (userIsDeletingThemselves) {
              setRedirectToPage(`/sites`)
            }
            setModalState(CollaboratorModalState.Default)
            handleDeleteCollaborator(deleteCollaboratorTarget.id)
          }}
        >
          {userIsDeletingThemselves ? "Remove myself" : "Remove collaborator"}
        </Button>
      </Stack>
    </>
  )
}

export { RemoveCollaboratorSubmodal }
