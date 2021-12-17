import { MediaCreationModal } from "components/MediaCreationModal"
import { useCreateMediaHook } from "hooks/mediaHooks"
import PropTypes from "prop-types"
import React from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

export const MediaCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { mutateAsync: createHandler } = useCreateMediaHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: mediasData } = useGetDirectoryHook(params, { initialData: [] })

  return (
    <MediaCreationModal
      params={decodedParams}
      onClose={onClose}
      onProceed={createHandler}
      mediasData={mediasData}
    />
  )
}

MediaCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
