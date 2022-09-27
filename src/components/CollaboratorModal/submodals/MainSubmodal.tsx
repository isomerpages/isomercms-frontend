import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  Grid,
  GridItem,
  Text,
  Box,
  Divider,
  FormControl,
  Input,
} from "@chakra-ui/react"
import {
  IconButton,
  ModalCloseButton,
  FormErrorMessage,
  FormLabel,
} from "@opengovsg/design-system-react"
import { useCollaboratorModalContext } from "components/CollaboratorModal/CollaboratorModalContext"
import { LoadingButton } from "components/LoadingButton"
import { BiTrash } from "react-icons/bi"

import { CollaboratorModalState } from "../constants"

const LAST_LOGGED_IN_THRESHOLD_IN_DAYS = 60
const numDaysAgo = (previousDateTime: string): number => {
  const currDateTime = new Date(Date.now())
  const prevDateTime = new Date(previousDateTime)
  return Math.floor(
    (currDateTime.getTime() - prevDateTime.getTime()) / (60 * 60 * 24 * 1000)
  )
}
const capitalizeOnlyFirstLetter = (word: string) =>
  word.charAt(0) + word.substring(1).toLowerCase()
const CollaboratorListSection = () => {
  const {
    collaboratorData,
    collaboratorRoleData,
    setDeleteCollaboratorTarget,
    localUser,
    setModalState,
  } = useCollaboratorModalContext()
  return (
    <Box m="10px" mt="40px">
      {collaboratorData &&
        // TODO: remove any type - requires moving shared types from the backend repo
        collaboratorData.collaborators.map((collaborator: any) => (
          <>
            <Grid
              templateColumns="repeat(11, 1fr)"
              h="56px"
              key={`collaborator-${collaborator.id}`}
            >
              <GridItem colSpan={8}>
                <Box display="flex" alignItems="center" h="100%">
                  <Text>{collaborator.email}</Text>
                  <Text pl="4px" color="gray.500">
                    {localUser.email === collaborator.email ? "(You)" : null}
                  </Text>
                  <Text pl="4px" color="danger.500">
                    {numDaysAgo(collaborator.lastLoggedIn) >=
                    LAST_LOGGED_IN_THRESHOLD_IN_DAYS
                      ? `(Last logged in ${numDaysAgo(
                          collaborator.lastLoggedIn
                        )} days ago)`
                      : null}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={2}>
                <Box display="flex" alignItems="center" h="100%">
                  <Text>
                    {capitalizeOnlyFirstLetter(collaborator.SiteMember.role)}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box display="flex" alignItems="center" h="100%">
                  <IconButton
                    aria-label="Delete collaborator button"
                    variant="clear"
                    colorScheme="danger"
                    onClick={() => {
                      setModalState(CollaboratorModalState.RemoveCollaborator)
                      setDeleteCollaboratorTarget(collaborator)
                    }}
                    id={`delete-${collaborator.id}`}
                    icon={<BiTrash color="icon.danger" />}
                    isDisabled={collaboratorRoleData?.role !== "ADMIN"}
                  />
                </Box>
              </GridItem>
            </Grid>
            <Divider />
          </>
        ))}
    </Box>
  )
}

const MainSubmodal = () => {
  const {
    setNewCollaboratorEmail,
    collaboratorRoleData,
    handleAddCollaborator,
    addCollaboratorError,
    setAddCollaboratorError,
  } = useCollaboratorModalContext()
  return (
    <>
      <ModalHeader>Manage collaborators</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl
          isRequired
          isInvalid={!!addCollaboratorError}
          isDisabled={collaboratorRoleData?.role !== "ADMIN"}
        >
          <FormLabel>Only admins can add or remove collaborators</FormLabel>
          <Input
            onChange={(event) => {
              setNewCollaboratorEmail(event.target.value)
              setAddCollaboratorError("")
            }}
          />
          <FormErrorMessage>{addCollaboratorError}</FormErrorMessage>
        </FormControl>
        <LoadingButton
          mt="16px"
          isDisabled={
            !!addCollaboratorError || collaboratorRoleData?.role !== "ADMIN"
          }
          onClick={handleAddCollaborator}
        >
          Add collaborator
        </LoadingButton>
        <CollaboratorListSection />
      </ModalBody>
      <ModalFooter />
    </>
  )
}

export { MainSubmodal }
