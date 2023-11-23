import PropTypes from "prop-types"

import { MediaCreationModal } from "components/MediaCreationModal"

export const MediaCreationScreen = ({ match, onClose }) => {
  const { decodedParams } = match

  return (
    <MediaCreationModal
      params={decodedParams}
      variant={decodedParams.mediaRoom}
      onClose={onClose}
      onProceed={onClose}
    />
  )
}

MediaCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
