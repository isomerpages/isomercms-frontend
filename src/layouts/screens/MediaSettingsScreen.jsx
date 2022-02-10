import { MediaSettingsModal } from "components/MediaSettingsModal"
import {
  useGetMediaHook,
  useCreateMediaHook,
  useUpdateMediaHook,
} from "hooks/mediaHooks"
import PropTypes from "prop-types"
import React from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

export const MediaSettingsScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { data: mediaData } = useGetMediaHook(params)
  const { mutateAsync: updateHandler } = useUpdateMediaHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: mediasData } = useGetDirectoryHook(params, { initialData: [] })

  return (
    <MediaSettingsModal
      params={decodedParams}
      onClose={onClose}
      mediaData={mediaData}
      mediasData={mediasData}
      onProceed={updateHandler}
    />
  )
}

MediaSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
