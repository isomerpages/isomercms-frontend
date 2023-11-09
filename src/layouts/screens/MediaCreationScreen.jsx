import PropTypes from "prop-types"

import { MediaCreationModal } from "components/MediaCreationModal"

import { useCreateMediaHook } from "hooks/mediaHooks"

export const MediaCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { mutateAsync: createHandler } = useCreateMediaHook(params, {
    onSuccess: () => onClose(),
  })

  return (
    <MediaCreationModal
      params={decodedParams}
      variant={decodedParams.mediaRoom}
      onClose={onClose}
      onProceed={createHandler}
    />
  )
}

MediaCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
