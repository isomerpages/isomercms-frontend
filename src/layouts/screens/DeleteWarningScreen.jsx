import DeleteWarningModal from "components/DeleteWarningModal"
import PropTypes from "prop-types"
import React from "react"

import { useDeleteDirectoryHook } from "hooks/directoryHooks"
import { useGetPageHook, useDeletePageHook } from "hooks/pageHooks"

import { getLastItemType, pageFileNameToTitle } from "utils"

export const DeleteWarningScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { fileName } = params
  const deleteItemName = pageFileNameToTitle(
    decodedParams[getLastItemType(decodedParams)],
    !!params.resourceRoomName
  )

  if (fileName) {
    const { data: pageData } = useGetPageHook(params)
    const { mutateAsync: deleteHandler } = useDeletePageHook(params, {
      onSuccess: () => onClose(),
    })

    return pageData ? (
      <DeleteWarningModal
        onDelete={() => deleteHandler({ sha: pageData.sha })}
        onCancel={() => onClose()}
        type={deleteItemName}
      />
    ) : null
  }
  const { mutateAsync: deleteHandler } = useDeleteDirectoryHook(params, {
    onSuccess: () => onClose(),
  })

  return (
    <DeleteWarningModal
      onDelete={deleteHandler}
      onCancel={() => onClose()}
      type={deleteItemName}
    />
  )
}

DeleteWarningScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
