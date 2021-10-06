import React from "react"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"
import DeleteWarningModal from "../../components/DeleteWarningModal"
import { useDeleteDirectoryHook } from "../../hooks/directoryHooks"
import { useGetPageHook, useDeletePageHook } from "../../hooks/pageHooks"
import { getLastItemType } from "../../utils"

export const DeleteWarningScreen = ({ onClose }) => {
  const params = useParams()
  const { fileName } = params
  const deleteItemType = params[getLastItemType(params)]

  if (fileName) {
    const { data: pageData } = useGetPageHook(params)
    const { mutateAsync: deleteHandler } = useDeletePageHook(params, {
      onSuccess: () => onClose(),
    })

    return pageData ? (
      <DeleteWarningModal
        onDelete={() => deleteHandler({ sha: pageData.sha })}
        onCancel={() => onClose()}
        type={deleteItemType}
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
      type={deleteItemType}
    />
  )
}

DeleteWarningScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
