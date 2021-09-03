import React from "react"
import PropTypes from "prop-types"

import { useParams } from "react-router-dom"

import ReorderingModal from "../../components/folders/ReorderingModal"

import {
  useGetDirectoryHook,
  useReorderDirectoryHook,
} from "../../hooks/directoryHooks"

export const FoldersReorderingScreen = ({ onClose }) => {
  const params = useParams()
  const { data: dirData } = useGetDirectoryHook(params, { initialData: [] })
  const { mutateAsync: reorderHandler } = useReorderDirectoryHook(params, {
    onSettled: onClose,
  })

  return (
    <ReorderingModal
      dirData={dirData}
      onProceed={reorderHandler}
      params={params}
      onClose={onClose}
    />
  )
}

FoldersReorderingScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
