import PropTypes from "prop-types"

import { MediaSettingsModal } from "components/MediaSettingsModal"

import { useGetMediaFolders } from "hooks/directoryHooks"
import { useGetMediaHook, useUpdateMediaHook } from "hooks/mediaHooks"

import { getFileName } from "utils"

export const MediaSettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { data: mediaData } = useGetMediaHook(params)
  const { mutateAsync: updateHandler } = useUpdateMediaHook(params, {
    onSuccess: onClose,
  })
  const { data: mediasData } = useGetMediaFolders(params, {
    initialData: { directories: [], files: [], total: 0 },
  })

  return (
    <MediaSettingsModal
      params={decodedParams}
      onClose={onClose}
      mediaData={mediaData}
      mediasData={mediasData.map(({ name, ...rest }) => ({
        name: getFileName(name),
        ...rest,
      }))}
      onProceed={updateHandler}
    />
  )
}

MediaSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
