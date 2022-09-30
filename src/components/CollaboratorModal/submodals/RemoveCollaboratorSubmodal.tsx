import {
  ModalHeader,
  ModalBody,
  Text,
  Stack,
  useModalContext,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import { useCollaboratorModalContext } from "components/CollaboratorModal/CollaboratorModalContext"

import { useLoginContext } from "contexts/LoginContext"

import { useDeleteCollaboratorHook } from "hooks/collaboratorHooks"
import useRedirectHook from "hooks/useRedirectHook"

const TEXT_FONT_SIZE = "14px"

const RemoveCollaboratorSubmodal = ({
  siteName,
}: {
  siteName: string
}): JSX.Element => {
  return (
    <>
      <ModalHeader>Remove collaborator?</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <RemoveCollaboratorSubmodalContent siteName={siteName} />
      </ModalBody>
    </>
  )
}
const RemoveCollaboratorSubmodalContent = ({
  siteName,
}: {
  siteName: string
}) => {
  const { deleteCollaboratorTarget } = useCollaboratorModalContext()
  const { setRedirectToPage } = useRedirectHook()
  const { email } = useLoginContext()
  const isUserDeletingThemselves = email === deleteCollaboratorTarget?.email
  const { onClose } = useModalContext()

  const { mutateAsync: deleteCollaborator } = useDeleteCollaboratorHook(
    siteName
  )

  return (
    <>
      {isUserDeletingThemselves ? (
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
        <Button variant="clear" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          colorScheme="danger"
          onClick={async () => {
            if (isUserDeletingThemselves) {
              setRedirectToPage(`http://localhost:3000/sites`)
            }
            await deleteCollaborator(deleteCollaboratorTarget.id)
            onClose()
          }}
        >
          {isUserDeletingThemselves ? "Remove myself" : "Remove collaborator"}
        </Button>
      </Stack>
    </>
  )
}

export { RemoveCollaboratorSubmodal }
