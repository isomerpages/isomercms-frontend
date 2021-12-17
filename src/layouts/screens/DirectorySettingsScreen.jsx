import axios from "axios"
import { DirectorySettingsModal } from "components/DirectorySettingsModal"
import PropTypes from "prop-types"
import React from "react"

import {
  useGetDirectoryHook,
  useUpdateDirectoryHook,
} from "hooks/directoryHooks"

import { getLastItemType, getMediaDirectoryName } from "utils"

// axios settings
axios.defaults.withCredentials = true

export const DirectorySettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { mutateAsync: renameDir } = useUpdateDirectoryHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: dirData } = useGetDirectoryHook(
    params.mediaDirectoryName
      ? {
          ...params,
          mediaDirectoryName: getMediaDirectoryName(params.mediaDirectoryName, {
            end: -1,
          }),
        }
      : (({ [getLastItemType(params)]: unused, ...p }) => p)(params),
    { initialData: [] }
  )

  return (
    <DirectorySettingsModal
      onProceed={renameDir}
      onClose={onClose}
      params={decodedParams}
      dirsData={dirData ? dirData.filter((item) => item.type === "dir") : []}
    />
  )
}

DirectorySettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
