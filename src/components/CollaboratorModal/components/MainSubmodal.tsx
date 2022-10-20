import {
  ModalHeader,
  ModalBody,
  Grid,
  GridItem,
  Text,
  Box,
  Divider,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalProps,
  useFormControlContext,
  Skeleton,
  Stack,
} from "@chakra-ui/react"
import {
  IconButton,
  ModalCloseButton,
  FormErrorMessage,
  FormLabel,
  Button,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BiTrash } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import * as CollaboratorHooks from "hooks/collaboratorHooks"

import { Collaborator } from "types/collaborators"
import { MiddlewareError } from "types/error"
import { DEFAULT_RETRY_MSG, useSuccessToast } from "utils"

import { ACK_REQUIRED_ERROR_MESSAGE } from "../constants"

import { AcknowledgementSubmodalContent } from "./AcknowledgementSubmodal"

const LAST_LOGGED_IN_THRESHOLD_IN_DAYS = 60

const numDaysAgo = (previousDateTime: string): number => {
  const currDateTime = new Date(Date.now())
  const prevDateTime = new Date(previousDateTime)
  return Math.floor(
    (currDateTime.getTime() - prevDateTime.getTime()) / (60 * 60 * 24 * 1000)
  )
}

interface CollaboratorListProps {
  onDelete: (user: Collaborator) => void
}

const CollaboratorListSection = ({ onDelete }: CollaboratorListProps) => {
  const { email } = useLoginContext()
  const { siteName } = useParams<{ siteName: string }>()
  const {
    data: collaborators,
    isError,
  } = CollaboratorHooks.useListCollaboratorsHook(siteName)
  const { isDisabled } = useFormControlContext()

  return (
    <Box mt="2.5rem">
      {collaborators?.map((collaborator: Collaborator) => {
        const numDaysSinceLastLogin = numDaysAgo(collaborator.lastLoggedIn)
        return (
          <>
            <Grid
              templateColumns="repeat(11, 1fr)"
              h="3.5rem"
              key={`collaborator-${collaborator.id}`}
            >
              <GridItem colSpan={8}>
                <Box display="flex" alignItems="center" h="100%">
                  <Text>{collaborator.email}</Text>
                  <Text pl="0.25rem" color="gray.500">
                    {email === collaborator.email ? "(You)" : null}
                  </Text>
                  {numDaysAgo(collaborator.lastLoggedIn) >=
                    LAST_LOGGED_IN_THRESHOLD_IN_DAYS && (
                    <Text pl="0.25rem" color="danger.500">
                      {`(Last logged in ${numDaysSinceLastLogin} days ago)`}
                    </Text>
                  )}
                </Box>
              </GridItem>
              <GridItem colSpan={2}>
                <Box display="flex" alignItems="center" h="100%">
                  <Text>{_.capitalize(collaborator.role)}</Text>
                </Box>
              </GridItem>
              <GridItem colSpan={1}>
                <Box display="flex" alignItems="center" h="100%">
                  <IconButton
                    aria-label="Delete collaborator button"
                    variant="clear"
                    colorScheme="danger"
                    onClick={() => onDelete(collaborator)}
                    id={`delete-${collaborator.id}`}
                    icon={<BiTrash color="icon.danger" />}
                    isDisabled={
                      isDisabled || isError || collaborators.length <= 1
                    }
                  />
                </Box>
              </GridItem>
            </Grid>
            <Divider />
          </>
        )
      }) ?? (
        <Stack>
          {Array(3)
            .fill(null)
            .map(() => (
              <Skeleton height="2rem" />
            ))}
        </Stack>
      )}
    </Box>
  )
}

const extractErrorMessage = (props: MiddlewareError | undefined): string => {
  if (!props || props?.code === 500) return DEFAULT_RETRY_MSG

  return props.message
}

interface MainSubmodalProps extends Omit<ModalProps, "children"> {
  onDelete: (user: Collaborator) => void
}

export const MainSubmodal = ({
  onDelete,
  ...props
}: MainSubmodalProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const successToast = useSuccessToast()
  const {
    mutateAsync: addCollaborator,
    error: addCollaboratorError,
    isSuccess: addCollaboratorSuccess,
    isError: isAddCollaboratorError,
    isLoading: isAddCollaboratorLoading,
    reset,
  } = CollaboratorHooks.useAddCollaboratorHook(siteName)
  const { data: role } = CollaboratorHooks.useGetCollaboratorRoleHook(siteName)

  const errorMessage = extractErrorMessage(
    addCollaboratorError?.response?.data.error
  )
  const showAckModal = errorMessage === ACK_REQUIRED_ERROR_MESSAGE
  const isDisabled = role !== "ADMIN"

  const collaboratorFormMethods = useForm({
    mode: "onTouched",
    defaultValues: {
      newCollaboratorEmail: "",
      isAcknowledged: false,
    },
  })

  const curCollaboratorValue = collaboratorFormMethods.watch(
    "newCollaboratorEmail"
  )

  useEffect(() => {
    if (addCollaboratorSuccess) {
      successToast({ description: "Collaborator added successfully" })
      collaboratorFormMethods.reset()
    }
  }, [addCollaboratorSuccess, collaboratorFormMethods, successToast])

  return (
    <Modal
      {...props}
      onCloseComplete={() => {
        reset()
        collaboratorFormMethods.resetField("isAcknowledged")
        props.onCloseComplete?.()
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
            <ModalHeader>
              {showAckModal
                ? "Acknowledge Terms of Use to continue"
                : "Manage collaborators"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody mb="3.25rem">
              {showAckModal ? (
                <AcknowledgementSubmodalContent
                  isLoading={isAddCollaboratorLoading}
                />
              ) : (
                <FormControl
                  isRequired
                  isInvalid={isAddCollaboratorError}
                  isDisabled={isDisabled}
                >
                  <FormLabel>
                    Only admins can add or remove collaborators
                  </FormLabel>
                  <Input
                    {...collaboratorFormMethods.register(
                      "newCollaboratorEmail",
                      {
                        required: true,
                      }
                    )}
                  />
                  <FormErrorMessage>{errorMessage}</FormErrorMessage>
                  <Button
                    isLoading={isAddCollaboratorLoading}
                    // NOTE: Setting this on the `FormControl` disables the whole form
                    isDisabled={isDisabled || !curCollaboratorValue}
                    mt="1rem"
                    type="submit"
                  >
                    Add collaborator
                  </Button>
                  <CollaboratorListSection onDelete={onDelete} />
                </FormControl>
              )}
            </ModalBody>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  )
}
