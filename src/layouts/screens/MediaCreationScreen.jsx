import { MediaCreationModal } from "components/MediaCreationModal"
import PropTypes from "prop-types"

import { useGetMediaFolders } from "hooks/directoryHooks"
import { useCreateMediaHook } from "hooks/mediaHooks"

export const MediaCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { mutateAsync: createHandler } = useCreateMediaHook(params, {
    onSuccess: () => onClose(),
  })
  const { data: mediasData } = useGetMediaFolders(params, { initialData: [] })

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
