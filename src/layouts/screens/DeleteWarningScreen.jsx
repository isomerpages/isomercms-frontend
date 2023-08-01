import { Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

import { LoadingButton } from "components/LoadingButton"
import { WarningModal } from "components/WarningModal"

import { useDeleteDirectoryHook } from "hooks/directoryHooks"
import { useGetMediaHook, useDeleteMediaHook } from "hooks/mediaHooks"
import { useGetPageHook, useDeletePageHook } from "hooks/pageHooks"

import {
  getLastItemType,
  getMediaDirectoryName,
  pageFileNameToTitle,
} from "utils"

export const DeleteWarningScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { fileName, mediaRoom } = params
  const deleteItemName = params.mediaDirectoryName
    ? getMediaDirectoryName(params.mediaDirectoryName, { start: -1 })
    : pageFileNameToTitle(
        decodedParams[getLastItemType(decodedParams)],
        !!(params.resourceRoomName && params.fileName)
      )

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

    return (
      <WarningModal
        isOpen={!!fileData}
        onClose={onClose}
        displayTitle={`Delete ${fileName}`}
        displayText={<Text>Are you sure you want to delete {fileName}?</Text>}
      >
        <Button variant="clear" colorScheme="secondary" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          colorScheme="critical"
          onClick={() => deleteHandler({ sha: fileData.sha })}
        >
          Yes, delete
        </LoadingButton>
      </WarningModal>
    )
  }

  const { mutateAsync: deleteHandler } = useDeleteDirectoryHook(params, {
    onSuccess: () => onClose(),
  })

  return (
    <WarningModal
      isOpen={!!deleteItemName} // Modal is always present for delete screens
      onClose={onClose}
      displayTitle={`Delete ${deleteItemName}`}
      displayText={
        <Text>Are you sure you want to delete {deleteItemName}?</Text>
      }
    >
      <Button variant="clear" colorScheme="secondary" onClick={onClose}>
        Cancel
      </Button>
      <LoadingButton colorScheme="critical" onClick={deleteHandler}>
        Yes, delete
      </LoadingButton>
    </WarningModal>
  )
}

DeleteWarningScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
