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
import { useFormContext } from "react-hook-form"
import { BiTrash } from "react-icons/bi"

import { useLoginContext } from "contexts/LoginContext"

import { CollaboratorError } from "types/collaborators"
import { DEFAULT_RETRY_MSG } from "utils"

import {
  CollaboratorModalState,
  ACK_REQUIRED_ERROR_MESSAGE,
} from "../constants"

const LAST_LOGGED_IN_THRESHOLD_IN_DAYS = 60

const numDaysAgo = (previousDateTime: string): number => {
  const currDateTime = new Date(Date.now())
  const prevDateTime = new Date(previousDateTime)
  return Math.floor(
    (currDateTime.getTime() - prevDateTime.getTime()) / (60 * 60 * 24 * 1000)
  )
}

const CollaboratorListSection = () => {
  const {
    collaboratorData,
    collaboratorRoleData,
    setDeleteCollaboratorTarget,
    setModalState,
  } = useCollaboratorModalContext()
  const { email } = useLoginContext()

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
                    {email === collaborator.email ? "(You)" : null}
                  </Text>
                  {numDaysAgo(collaborator.lastLoggedIn) >=
                    LAST_LOGGED_IN_THRESHOLD_IN_DAYS && (
                    <Text pl="4px" color="danger.500">
                      {`(Last logged in ${numDaysAgo(
                        collaborator.lastLoggedIn
                      )} days ago)`}
                    </Text>
                  )}
                </Box>
              </GridItem>
              <GridItem colSpan={2}>
                <Box display="flex" alignItems="center" h="100%">
                  <Text textTransform="capitalize">
                    {collaborator.SiteMember.role}
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

const extractErrorMessage = (props: CollaboratorError | undefined): string => {
  if (!props) return DEFAULT_RETRY_MSG

  const { code, message } = props
  return code === 500 ? DEFAULT_RETRY_MSG : message
}

interface MainSubmodalProps {
  addCollaboratorError?: CollaboratorError
}

export const MainSubmodal = ({
  addCollaboratorError,
}: MainSubmodalProps): JSX.Element => {
  const { collaboratorRoleData } = useCollaboratorModalContext()
  const { register } = useFormContext<{
    newCollaboratorEmail: string
    isAcknowledged: boolean
  }>()

  const errorMessage = extractErrorMessage(addCollaboratorError)

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

          <Input {...register("newCollaboratorEmail")} />
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>
        <LoadingButton
          mt="16px"
          isDisabled={
            // Made this more specific for readability
            (!!addCollaboratorError &&
              errorMessage !== ACK_REQUIRED_ERROR_MESSAGE) ||
            collaboratorRoleData?.role !== "ADMIN"
          }
          type="submit"
        >
          Add collaborator
        </LoadingButton>
        <CollaboratorListSection />
      </ModalBody>
      <ModalFooter />
    </>
  )
}
