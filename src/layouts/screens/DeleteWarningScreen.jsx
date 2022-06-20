import { Button } from "@opengovsg/design-system-react"
import { GenericWarningModal } from "components/GenericWarningModal"
import PropTypes from "prop-types"
import { useState } from "react"

import { useDeleteDirectoryHook } from "hooks/directoryHooks"
import { useGetMediaHook, useDeleteMediaHook } from "hooks/mediaHooks"
import { useGetPageHook, useDeletePageHook } from "hooks/pageHooks"

import {
  getLastItemType,
  getMediaDirectoryName,
  pageFileNameToTitle,
} from "utils"

export const DeleteWarningScreen = ({ match, onClose }) => {
  const [isOnClickLoading, setIsOnClickLoading] = useState(false)
  const { params, decodedParams } = match
  const { fileName, mediaRoom } = params
  const deleteItemName = params.mediaDirectoryName
    ? getMediaDirectoryName(params.mediaDirectoryName, { start: -1 })
    : pageFileNameToTitle(
        decodedParams[getLastItemType(decodedParams)],
        !!params.resourceRoomName
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

    return fileData ? (
      <GenericWarningModal
        isOpen // Modal is always present for delete screens
        onClose={onClose}
        displayTitle={`Delete ${fileName}`}
        displayText={`Are you sure you want to delete ${fileName}?`}
      >
        <Button variant="ghost" colorScheme="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          isLoading={isOnClickLoading}
          colorScheme="danger"
          onClick={() => {
            setIsOnClickLoading(true)
            deleteHandler({ sha: fileData.sha })
          }}
        >
          Yes, delete
        </Button>
      </GenericWarningModal>
    ) : null
  }

  const { mutateAsync: deleteHandler } = useDeleteDirectoryHook(params, {
    onSuccess: () => onClose(),
  })

  return (
    <GenericWarningModal
      isOpen // Modal is always present for delete screens
      onClose={onClose}
      displayTitle={`Delete ${deleteItemName}`}
      displayText={`Are you sure you want to delete ${deleteItemName}?`}
    >
      <Button variant="ghost" colorScheme="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        isLoading={isOnClickLoading}
        colorScheme="danger"
        onClick={() => {
          setIsOnClickLoading(true)
          deleteHandler()
        }}
      >
        Yes, delete
      </Button>
    </GenericWarningModal>
  )
}

DeleteWarningScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
