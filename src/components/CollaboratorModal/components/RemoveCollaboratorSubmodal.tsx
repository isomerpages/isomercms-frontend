import {
  ModalHeader,
  ModalBody,
  Text,
  Stack,
  ModalProps,
  ModalOverlay,
  Modal,
  ModalContent,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import { useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { useDeleteCollaboratorHook } from "hooks/collaboratorHooks"

import { Collaborator } from "types/collaborators"

import { TEXT_FONT_SIZE } from "../constants"

interface RemoveCollaboratorSubmodalProps extends Omit<ModalProps, "children"> {
  userToDelete: Collaborator
  onDeleteComplete: () => void
}

export const RemoveCollaboratorSubmodal = ({
  userToDelete,
  onDeleteComplete,
  ...props
}: RemoveCollaboratorSubmodalProps): JSX.Element => {
  const { email } = useLoginContext()
  const { siteName } = useParams<{ siteName: string }>()
  const isUserDeletingThemselves = email === userToDelete?.email
  const { onClose } = props

  const {
    mutateAsync: deleteCollaborator,
    isLoading: isDeleteCollaboratorLoading,
  } = useDeleteCollaboratorHook(siteName)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove collaborator?</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="44px">
          {isUserDeletingThemselves ? (
            <Text>
              Once you remove yourself as a collaborator, you will no longer be
              able to make any changes to this site.
            </Text>
          ) : (
            <Text fontSize={TEXT_FONT_SIZE}>
              <Text as="span">Once you remove</Text>
              <Text color="danger.700" as="strong">
                {" "}
                {userToDelete?.email}{" "}
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
              isDisabled={!userToDelete}
              isLoading={isDeleteCollaboratorLoading}
              onClick={async () => {
                // NOTE: As we disable this if the userToDelete is empty,
                // this is a safe assertion
                await deleteCollaborator(userToDelete.id)
                onDeleteComplete()
              }}
            >
              {isUserDeletingThemselves
                ? "Remove myself"
                : "Remove collaborator"}
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
