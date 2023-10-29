import { Text } from "@chakra-ui/react"
import { Button, Checkbox } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"
import { useState } from "react"

import { LoadingButton } from "components/LoadingButton"
import { WarningModal } from "components/WarningModal"

import { useDeleteDirectoryHook } from "hooks/directoryHooks"
import { useGetMediaHook, useDeleteMediaHook } from "hooks/mediaHooks"
import { useGetPageHook, useDeletePageHook } from "hooks/pageHooks"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import {
  getLastItemType,
  getMediaDirectoryName,
  pageFileNameToTitle,
} from "utils"

export const DeleteWarningScreen = ({ match, onClose }) => {
  const [isDeleteChecked, setIsDeleteChecked] = useState(false)
  const { params, decodedParams } = match
  const { siteName, fileName, mediaRoom } = params
  const deleteItemName = params.mediaDirectoryName
    ? getMediaDirectoryName(params.mediaDirectoryName, { start: -1 })
    : pageFileNameToTitle(
        decodedParams[getLastItemType(decodedParams)],
        !!(params.resourceRoomName && params.fileName)
      )

  console.log(`match`, match)
  const isWriteDisabled = isWriteActionsDisabled(siteName)

  if (fileName) {
    const { data: fileData } = mediaRoom
      ? useGetMediaHook(params)
      : useGetPageHook(params)
    const { mutateAsync: deleteHandler } = mediaRoom
      ? useDeleteMediaHook(params, {
          onSuccess: () => onClose(),
        })
      : useDeletePageHook(params, {
          onSuccess: () => onClose(),
        })

    const mediaType = mediaRoom === "images" ? "image" : "file"

    return (
      <WarningModal
        isOpen={!!fileData}
        onClose={onClose}
        displayTitle={`Delete ${fileName}?`}
        displayText={
          <Text>
            Are you sure you want to delete this {mediaType}? If you used this{" "}
            {mediaType} on any page, site visitors may see a broken {mediaType}.
            This cannot be undone.
          </Text>
        }
      >
        <Checkbox onChange={(e) => setIsDeleteChecked(e.target.checked)}>
          Yes, delete {mediaType}
        </Checkbox>
        <Button variant="clear" colorScheme="secondary" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          colorScheme="critical"
          onClick={() => deleteHandler({ sha: fileData.sha })}
          isDisabled={isWriteDisabled || !isDeleteChecked}
        >
          Delete {mediaType}
        </LoadingButton>
      </WarningModal>
    )
  }

  const { mutateAsync: deleteHandler } = useDeleteDirectoryHook(params, {
    onSuccess: () => onClose(),
  })

  const mediaType =
    mediaRoom === "images"
      ? { dirType: "album", resourceType: "image" }
      : { dirType: "folder", resourceType: "file" }

  return (
    <WarningModal
      isOpen={!!deleteItemName} // Modal is always present for delete screens
      onClose={onClose}
      displayTitle={`Delete ${deleteItemName}?`}
      displayText={
        <Text>
          Are you sure you want to delete this {mediaType.dirType} and all its
          child {mediaType.dirType}s and {mediaType.resourceType}s? If you used
          its child contents on any page, site visitors may see a broken{" "}
          {mediaType.resourceType}. This cannot be undone.
        </Text>
      }
    >
      <Checkbox onChange={(e) => setIsDeleteChecked(e.target.checked)}>
        Yes, delete this {mediaType.dirType} and all its contents
      </Checkbox>
      <Button variant="clear" colorScheme="secondary" onClick={onClose}>
        Cancel
      </Button>
      <LoadingButton
        colorScheme="critical"
        onClick={deleteHandler}
        isDisabled={isWriteDisabled || !isDeleteChecked}
      >
        Delete {mediaType.dirType}
      </LoadingButton>
    </WarningModal>
  )
}

DeleteWarningScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
