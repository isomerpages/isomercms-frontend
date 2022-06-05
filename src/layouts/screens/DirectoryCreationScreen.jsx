import {
  SimpleGrid,
  useBoolean,
  useDisclosure,
  Icon,
  Text,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Card, CardBody } from "components/Card"
import { DirectoryCreationModal } from "components/DirectoryCreationModal"
import {
  DirectorySettingsModal,
  DirectorySettingsSchema,
} from "components/DirectorySettingsModal"
import PropTypes from "prop-types"
import { FormProvider, useForm } from "react-hook-form"
import { BiFileBlank } from "react-icons/bi"

import {
  useCreateDirectoryHook,
  useGetDirectoryHook,
} from "hooks/directoryHooks"

import { getDirectoryCreationType } from "utils/directoryUtils"

import { pageFileNameToTitle } from "utils"

// axios settings
axios.defaults.withCredentials = true

const getDirsData = (pagesData, dirData) => {
  if (pagesData) {
    return dirData || []
  }

  if (dirData) {
    return dirData.filter((item) => item.type === "dir")
  }

  return []
}

const _getPagesData = (pagesData, dirData) => {
  if (pagesData)
    return pagesData
      .filter((item) => item.name !== "contact-us.md")
      .filter((item) => item.type === "file")

  if (dirData) return dirData.filter((item) => item.type === "file")

  return []
}

// eslint-disable-next-line import/prefer-default-export
export const DirectoryCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const [isCreation, { on: showCreation }] = useBoolean()

  const { data: dirsData } = useGetDirectoryHook(params, { initialData: [] })
  const { mutateAsync: onSave } = useCreateDirectoryHook(params)
  const { isOpen: _isOpen, onClose: onModalClose } = useDisclosure()
  const {
    siteName: _siteName,
    collectionName,
    resourceRoomName,
    mediaDirectoryName,
  } = params
  const existingTitlesArray = dirsData.map((item) => item.name)

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(DirectorySettingsSchema(existingTitlesArray)),
    context: {
      type: getDirectoryCreationType(
        mediaDirectoryName,
        resourceRoomName,
        collectionName
      ),
    },
  })

  // NOTE: all of usages involving directory creation screen have a onClose prop passed.
  // This is a history.goBack call, which is used due to redirection to a new page for a modal.
  // This should be removed but until then, this exists to hide that.

  const closeModal = () => {
    onModalClose()
    onClose()
  }

  const { data: pagesData } = useGetDirectoryHook(
    {
      ...params,
      isUnlinked: true,
    },
    { enabled: !params.collectionName }
  )

  const showSelectPages = !params.resourceRoomName
  // showSelectPages
  // ? () => setIsSelectingPages(true)
  // : (data) => onProceed(data)

  return (
    <FormProvider {...methods}>
      {!isCreation && (
        <DirectorySettingsModal
          isCreate
          params={decodedParams}
          dirsData={getDirsData(pagesData, dirsData)}
          onProceed={showSelectPages ? showCreation : onSave}
          onClose={closeModal}
        />
      )}
      <DirectoryCreationModal
        isOpen={isCreation}
        directoryType="files"
        onClose={closeModal}
        onSubmit={onSave}
      >
        <SimpleGrid columns={3} spacing="1.5rem">
          {pagesData &&
            pagesData.length > 0 &&
            pagesData
              .filter((page) => page.name !== "contact-us.md")
              .map(({ name }) => (
                <Card variant="single">
                  <CardBody>
                    <Icon as={BiFileBlank} fontSize="1.5rem" fill="icon.alt" />
                    <Text textStyle="subhead-1" color="text.label">
                      {pageFileNameToTitle(name)}
                    </Text>
                  </CardBody>
                </Card>
              ))}
        </SimpleGrid>
      </DirectoryCreationModal>
    </FormProvider>
  )
}

DirectoryCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
