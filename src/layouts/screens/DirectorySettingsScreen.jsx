import React from "react"
import axios from "axios"
import PropTypes from "prop-types"

import { getLastItemType } from "../../utils"

import {
  useGetDirectoryHook,
  useUpdateDirectoryHook,
} from "../../hooks/directoryHooks"

import DirectorySettingsModal from "../../components/DirectorySettingsModal"

// axios settings
axios.defaults.withCredentials = true

export const DirectorySettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

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
      params={decodedParams}
      dirData={dirData}
    />
  )
}

DirectorySettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
