import { MediaMoveModal } from "components/MediaMoveModal"
import { PageMoveModal } from "components/PageMoveModal"
import PropTypes from "prop-types"

import { useMoveHook } from "hooks/moveHooks"

export const MoveScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { mediaRoom } = params
  const { mutateAsync: moveHandler } = useMoveHook(
    (({ fileName, ...p }) => p)(params),
    {
      onSuccess: () => onClose(),
    }
  )

  return (
    <>
      {mediaRoom ? (
        <MediaMoveModal
          queryParams={params}
          params={decodedParams}
          onProceed={moveHandler}
          onClose={onClose}
        />
      ) : (
        <PageMoveModal
          queryParams={params}
          params={decodedParams}
          onProceed={moveHandler}
          onClose={onClose}
        />
      )}
    </>
  )
}

MoveScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
