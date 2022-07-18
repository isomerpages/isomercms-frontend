import {
  Box,
  Divider,
  FormControl,
  SimpleGrid,
  Skeleton,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react"
import {
  Button,
  FormLabel,
  FormErrorMessage,
  Input,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { ContextMenu } from "components/ContextMenu"
import _ from "lodash"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BiBulb, BiInfoCircle, BiWrench } from "react-icons/bi"
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
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
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
import { DEFAULT_RETRY_MSG } from "utils"

import { ResourceRoomNameUpdateProps } from "../../types/directory"
import { SiteViewLayout } from "../layouts"

import { CategoryCard, ResourceBreadcrumb } from "./components"

const EmptyResourceRoom = () => {
  const params = useParams<ResourceRoomRouteParams>()
  const { siteName } = params
  const { mutateAsync: saveHandler, isLoading, isError } = useCreateDirectory(
    siteName
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newDirectoryName: "",
    },
  })

  const onSubmit = (data: DirectoryInfoProps["data"]) => {
    saveHandler({ data })
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

  return (
    <SiteViewLayout>
      <Box as="form" w="full">
        {/* Resource Room does not exist */}
        <Section align="flex-start">
          <SectionHeader label="Create Resource Room" />
          <SectionCaption label="NOTE: " icon={BiInfoCircle}>
            You must create a Resource Room before you can create Resources.
          </SectionCaption>
          {/* Info segment */}
          <FormControl
            isRequired
            isInvalid={!!errors.newDirectoryName?.message}
          >
            <Input
              maxW="50%"
              {...register("newDirectoryName", { required: true })}
            />
            <FormErrorMessage>
              {errors.newDirectoryName?.message}
            </FormErrorMessage>
          </FormControl>
          {/* Segment divider  */}
          <Divider color="border.divider.alt" />
          <Button
            type="submit"
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}
            isDisabled={!_.isEmpty(errors)}
          >
            Create Resource Room
          </Button>
        </Section>
      </Box>
    </SiteViewLayout>
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
      {!isResourceRoomNameLoading && !resourceRoomName ? (
        <EmptyResourceRoom />
      ) : (
        <ResourceRoomContent
          directoryData={dirsData || []}
          isLoading={!isLoading && !isResourceRoomNameLoading}
        />
      )}
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
  } = useForm<ResourceRoomNameUpdateProps>({
    mode: "onTouched",
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
          <Box w="full">
            <SectionHeader label="Resource Categories">
              <CreateButton as={RouterLink} to={`${url}/createDirectory`}>
                Create category
              </CreateButton>
            </SectionHeader>
            <SectionCaption icon={BiBulb} label="PRO TIP: ">
              Categories impact navigation on your site. Organise your resources
              by creating categories.
            </SectionCaption>
          </Box>
          <Skeleton isLoaded={isLoading} w="100%">
            {directoryData.length === 0 ? (
              <Text>No Categories.</Text>
            ) : (
              directoryData &&
              directoryData.length > 0 && (
                <SimpleGrid columns={3} spacing="1.5rem">
                  {directoryData.map(({ name }) => (
                    <CategoryCard title={name} />
                  ))}
                </SimpleGrid>
              )
            )}
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
              <FormControl isRequired>
                <FormLabel>Resource room title</FormLabel>
                <Input
                  placeholder="New resource room name"
                  {...register("newDirectoryName", { required: true })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack w="100%" spacing={4} justifyContent="flex-end">
                <Button variant="outline" onClick={onClose}>
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
