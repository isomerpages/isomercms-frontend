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

export const DirectorySettingsScreen = ({ onClose }) => {
  const params = useParams()

  const { mutateAsync: renameDir } = useUpdateDirectoryHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: dirData } = useGetDirectoryHook(
    (({ [getLastItemType(params)]: unused, ...p }) => p)(params),
    { initialData: [] }
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

DirectorySettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
