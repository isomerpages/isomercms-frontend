import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  HStack,
  Divider,
  VStack,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { ModalCloseButton, Button } from "@opengovsg/design-system-react"
import axios from "axios"
import {
  DirectorySettingsSchema,
  DirectorySettingsModal,
} from "components/DirectorySettingsModal"
import { FolderCard } from "components/FolderCard"
import _ from "lodash"
import PropTypes from "prop-types"
import { useState } from "react"
import { useFieldArray, useForm, FormProvider } from "react-hook-form"

import { getDirectoryCreationType } from "utils/directoryUtils"

import { pageFileNameToTitle } from "utils"

import { useCreateDirectoryHook } from "../../hooks/directoryHooks/useCreateDirectoryHook"
// axios settings
axios.defaults.withCredentials = true

// eslint-disable-next-line import/prefer-default-export
export const DirectoryCreationModal = ({
  params,
  dirsData,
  onClose,
  pagesData,
  showSelectPages,
}) => {
  const {
    siteName,
    collectionName,
    resourceRoomName,
    mediaDirectoryName,
  } = params

  const { mutateAsync: onProceed, isLoading } = useCreateDirectoryHook(params)

  const [isSelectingPages, setIsSelectingPages] = useState(false)

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

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: methods.control,
  })

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
    return onProceed({
      data,
      mediaDirectoryName,
    })
  }

  // Sub-component used here for clarity
  const FolderContents = () => {
    if (pagesData && pagesData.length > 0) {
      return (
        <VStack alignItems="flex-start" spacing={8} w="100%">
          {_.chunk(pagesData, 3).map((rows) => (
            <HStack w="100%" spacing={8}>
              {rows.map((pageData, pageIdx) => (
                <FolderCard
                  displayText={pageFileNameToTitle(pageData.name)}
                  settingsToggle={() => {}}
                  key={pageData.name}
                  pageType="file"
                  siteName={siteName}
                  itemIndex={pageIdx}
                  selectedIndex={
                    fields.findIndex((item) => item.name === pageData.name) !==
                    -1
                      ? fields.findIndex(
                          (item) => item.name === pageData.name
                        ) + 1
                      : null
                  }
                  onClick={() => {
                    const indexOfItem = fields.findIndex(
                      (item) => item.name === pageData.name
                    )

                    if (indexOfItem !== -1) {
                      remove(indexOfItem)
                    } else {
                      append({ name: pageData.name, type: "file" })
                    }
                  }}
                />
              ))}
            </HStack>
          ))}
        </VStack>
      )
    }

    if (pagesData) {
      return "There are no pages in this folder."
    }

    return "Loading Pages..."
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      {!isSelectingPages && (
        <DirectorySettingsModal
          isCreate
          params={params}
          dirsData={dirsData}
          onProceed={
            showSelectPages
              ? () => setIsSelectingPages(true)
              : (data) => onProceed(data)
          }
          onClose={onClose}
        />
      )}
      <Modal
        onClose={onClose}
        size="full"
        isOpen={showSelectPages && isSelectingPages}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent pt={24.5} bgColor="#F9F9F9">
          <ModalCloseButton colorScheme="primary" />
          {/*
           * NOTE: We have to set padding separately for header/body;
           * This is because using a box and setting flex = 1 + padding causes the scrollbar to not appear
           */}
          <ModalHeader paddingInline="264px">
            <VStack spacing={1.5} align="flex-start">
              <Text textStyle="display-2">
                {`Select items to add into '${methods.watch(
                  "newDirectoryName"
                )}'`}
              </Text>
              <Text textStyle="body-2">
                Pages will be ordered by the order of selection
              </Text>
            </VStack>
          </ModalHeader>
          <ModalBody px="264px">
            <VStack spacing="46px" mt={8} align="flex-start">
              <Divider borderColor="#E9E9E9" />
              <Text textStyle="body-2">Ungrouped pages</Text>
              <FolderContents />
            </VStack>
          </ModalBody>
          <ModalFooter bg="white" borderTop="1px solid" borderColor="#E9E9E9">
            <HStack spacing={2}>
              <Button onClick={onClose} variant="clear">
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                onClick={methods.handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  )
}

DirectoryCreationModal.propTypes = {
  parentFolder: PropTypes.string.isRequired,
  existingSubfolders: PropTypes.arrayOf(PropTypes.string).isRequired,
  pagesData: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  siteName: PropTypes.string.isRequired,
  setIsFolderCreationActive: PropTypes.func.isRequired,
}
