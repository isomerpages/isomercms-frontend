import axios from "axios"
import PropTypes from "prop-types"
import React from "react"

import { DirectorySettingsModal } from "components/DirectorySettingsModal"

import {
  useGetDirectoryHook,
  useUpdateDirectoryHook,
} from "hooks/directoryHooks"

import { getLastItemType } from "utils"

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
