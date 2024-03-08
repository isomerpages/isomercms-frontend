import PropTypes from "prop-types"

import { MediaSettingsModal } from "components/MediaSettingsModal"

import { useGetMediaHook, useUpdateMediaHook } from "hooks/mediaHooks"

export const MediaSettingsScreen = ({ match, onClose }) => {
  const { params } = match
  const { data: mediaData } = useGetMediaHook(params)
  const { mutateAsync: updateHandler } = useUpdateMediaHook(params, {
    onSuccess: onClose,
  })

  return (
    <MediaSettingsModal
      params={params}
      onClose={onClose}
      mediaData={mediaData}
      onProceed={updateHandler}
    />
  )
}

MediaSettingsScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
