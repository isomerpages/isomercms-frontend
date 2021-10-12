import React from "react"
import PropTypes from "prop-types"

import ReorderingModal from "../../components/folders/ReorderingModal"

import {
  useGetDirectoryHook,
  useReorderDirectoryHook,
} from "../../hooks/directoryHooks"

export const ReorderingScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { data: dirData } = useGetDirectoryHook(params, { initialData: [] })
  const { mutateAsync: reorderHandler } = useReorderDirectoryHook(params, {
    onSettled: onClose,
  })

  return (
    <ReorderingModal
      dirData={dirData}
      onProceed={reorderHandler}
      params={decodedParams}
      onClose={onClose}
    />
  )
}

ReorderingScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
