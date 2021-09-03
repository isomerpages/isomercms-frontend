import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"

import { getLastItemType } from "../../utils"

import {
  useGetDirectoryHook,
  useUpdateDirectoryHook,
} from "../../hooks/directoryHooks"

import DirectorySettingsModal from "../../components/DirectorySettingsModal"

// axios settings
axios.defaults.withCredentials = true

export const FoldersDirectorySettingsScreen = ({ onClose }) => {
  const params = useParams()

  const { mutateAsync: renameDir } = useUpdateDirectoryHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: dirData } = useGetDirectoryHook(
    (({ [getLastItemType(params)]: unused, ...p }) => p)(params)
  )

  return (
    <DirectorySettingsModal
      onProceed={renameDir}
      onClose={onClose}
      params={params}
      dirData={dirData}
    />
  )
}

FoldersDirectorySettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
