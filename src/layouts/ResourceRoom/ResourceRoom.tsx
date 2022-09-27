import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Button, FormLabel, Input } from "@opengovsg/design-system-react"
import { ContextMenu } from "components/ContextMenu"
import { EmptyArea } from "components/EmptyArea"
import _ from "lodash"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BiPlus, BiWrench, BiBulb } from "react-icons/bi"
import {
  Link as RouterLink,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom"

import {
  useCreateDirectory,
  useGetResourceRoom,
  useGetResourceRoomName,
  useUpdateResourceRoomName,
} from "hooks/directoryHooks"

import {
  CreateButton,
  Section,
  SectionCaption,
  SectionHeader,
} from "layouts/components"
import {
  DirectoryCreationScreen,
  DeleteWarningScreen,
  DirectorySettingsScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { useErrorToast, useSuccessToast } from "utils/toasts"

import { DirectoryData, DirectoryInfoProps } from "types/directory"
import { ResourceRoomRouteParams } from "types/resources"
import { DEFAULT_RETRY_MSG, deslugifyDirectory } from "utils"

import { ResourceRoomNameUpdateProps } from "../../types/directory"
import { SiteViewLayout } from "../layouts"

import { CategoryCard, ResourceBreadcrumb } from "./components"

const EmptyResourceRoom = () => {
  const params = useParams<ResourceRoomRouteParams>()
  const { siteName } = params
  const { mutateAsync: saveHandler, isError, isLoading } = useCreateDirectory(
    siteName
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    newDirectoryName: string
  }>({
    mode: "onTouched",
  })

  const onSubmit = async (data: DirectoryInfoProps["data"]) => {
    await saveHandler({ data })
  }

  const errorToast = useErrorToast()

  // Trigger an error toast informing the user if settings data could not be fetched
  useEffect(() => {
    if (isError) {
      errorToast({
        title: "Error",
        description: `A new directory could not be created. ${DEFAULT_RETRY_MSG}`,
      })
    }
  }, [errorToast, isError])

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <SiteViewLayout>
        <Center as="form" mt="6rem">
          {/* Resource Room does not exist */}
          <EmptyArea
            isItemEmpty
            actionButton={
              <Button
                onClick={onOpen}
                leftIcon={<Icon as={BiPlus} fontSize="1.5rem" fill="white" />}
              >
                Create Resource Room
              </Button>
            }
            subText="Create a resource room to get started."
          />
        </Center>
      </SiteViewLayout>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create resource room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textStyle="subhead-1">Resource room title</Text>

            <FormControl
              isRequired
              isInvalid={!!errors.newDirectoryName?.message}
            >
              <Input
                marginTop={5}
                placeholder="Resource room name"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register("newDirectoryName", {
                  required: "Please enter resource room name",
                })}
              />
              <FormErrorMessage>
                {errors.newDirectoryName?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant="clear" onClick={onClose}>
              <Text textStyle="subhead-1">Cancel</Text>
            </Button>
            <Button
              isDisabled={!_.isEmpty(errors)}
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const ResourceRoom = (): JSX.Element => {
  const { siteName, resourceRoomName } = useParams<ResourceRoomRouteParams>()
  const {
    data: queriedResourceRoomName,
    isLoading: isResourceRoomNameLoading,
  } = useGetResourceRoomName(siteName)
  const { path } = useRouteMatch()
  const history = useHistory()

  const shouldRedirect =
    (resourceRoomName && resourceRoomName !== queriedResourceRoomName) ||
    (!resourceRoomName && queriedResourceRoomName)

  const { data: dirsData, isLoading } = useGetResourceRoom(
    { siteName, resourceRoomName },
    {
      enabled:
        !!resourceRoomName && queriedResourceRoomName === resourceRoomName,
    }
  )

  return (
    <Route>
      {!isResourceRoomNameLoading && shouldRedirect && (
        <Redirect
          to={`/sites/${siteName}/resourceRoom/${
            queriedResourceRoomName || ""
          }`}
        />
      )}
      <Skeleton isLoaded={!isResourceRoomNameLoading}>
        {resourceRoomName ? (
          <ResourceRoomContent
            directoryData={dirsData || []}
            isLoading={!isLoading && !isResourceRoomNameLoading}
          />
        ) : (
          <EmptyResourceRoom />
        )}
      </Skeleton>
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/deleteDirectory/:resourceCategoryName`]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:resourceCategoryName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </Route>
  )
}

interface ResourceRoomContentProps {
  directoryData: DirectoryData[]
  isLoading?: boolean
}

const ResourceRoomContent = ({
  directoryData,
  isLoading,
}: ResourceRoomContentProps): JSX.Element => {
  const { url } = useRouteMatch()
  const { siteName, resourceRoomName } = useParams<ResourceRoomRouteParams>()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceRoomNameUpdateProps>({
    mode: "onTouched",
    defaultValues: {
      // NOTE: We need to deslugify this as the name
      // is slugified by default to enable the backend to parse it.
      newDirectoryName: deslugifyDirectory(resourceRoomName),
    },
  })
  const {
    mutateAsync: updateResourceRoomName,
    isLoading: isUpdateResourceRoomNameLoading,
    isError: isUpdateResourceRoomNameError,
    isSuccess: isUpdateResourceRoomNameSuccess,
  } = useUpdateResourceRoomName(siteName, resourceRoomName)
  const errorToast = useErrorToast()
  const successToast = useSuccessToast()

  useEffect(() => {
    if (isUpdateResourceRoomNameError) {
      errorToast({
        title: "",
        description:
          "Unable to update resource room settings, please try again later!",
      })
    }
  }, [errorToast, isUpdateResourceRoomNameError])

  useEffect(() => {
    if (isUpdateResourceRoomNameSuccess) {
      successToast({
        title: "",
        description: `Updated resource room settings successfully.`,
      })
      reset()
    }
  }, [isUpdateResourceRoomNameSuccess, reset, successToast])

  return (
    <>
      <SiteViewLayout>
        <Section>
          <Box>
            <HStack spacing="0.25rem" alignItems="center">
              <Text as="h2" textStyle="h2">
                Resources
              </Text>
              <ContextMenu>
                <ContextMenu.Button position="relative" bottom={0} right={0} />
                <ContextMenu.List>
                  <ContextMenu.Item
                    icon={<BiWrench fill="icon.alt" />}
                    onClick={onOpen}
                  >
                    <Text mr="3.5rem" color="text.body">
                      Room settings
                    </Text>
                  </ContextMenu.Item>
                </ContextMenu.List>
              </ContextMenu>
            </HStack>
            <ResourceBreadcrumb />
          </Box>
        </Section>
        <Section>
          {directoryData.length !== 0 && (
            <Box w="full">
              <SectionHeader label="Resource Categories">
                <CreateButton as={RouterLink} to={`${url}/createDirectory`}>
                  Create category
                </CreateButton>
              </SectionHeader>
              <SectionCaption icon={BiBulb} label="PRO TIP: ">
                Categories impact navigation on your site. Organise your
                resources by creating categories.
              </SectionCaption>
            </Box>
          )}
          <Skeleton isLoaded={isLoading} w="100%">
            <EmptyArea
              isItemEmpty={!directoryData?.length}
              actionButton={
                <Button
                  as={RouterLink}
                  to={`${url}/createDirectory`}
                  leftIcon={<Icon as={BiPlus} fontSize="1.5rem" fill="white" />}
                >
                  Create category
                </Button>
              }
              subText="Create a resource category to get started."
            >
              <SimpleGrid columns={3} spacing="1.5rem">
                {directoryData.map(({ name }) => (
                  <CategoryCard title={name} />
                ))}
              </SimpleGrid>
            </EmptyArea>
          </Skeleton>
        </Section>
      </SiteViewLayout>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={handleSubmit(async (data) => {
              await updateResourceRoomName(data)
              onClose()
            })}
          >
            <ModalHeader>
              <Text>Edit resource room settings</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl
                isRequired
                isInvalid={!!errors.newDirectoryName?.message}
              >
                <FormLabel>Resource room title</FormLabel>
                <Input
                  placeholder="New resource room name"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register("newDirectoryName", {
                    required:
                      "Please ensure that you have entered a resource room name!",
                  })}
                />
                <FormErrorMessage>
                  {errors.newDirectoryName?.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack w="100%" spacing={4} justifyContent="flex-end">
                <Button variant="clear" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isUpdateResourceRoomNameLoading}
                >
                  Save
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
