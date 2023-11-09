import _ from "lodash"
import PropTypes from "prop-types"

import { PageMoveModal } from "components/PageMoveModal"

import { useMoveHook } from "hooks/moveHooks"

export const MoveScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { mutateAsync: moveHandler } = useMoveHook(_.omit(params, "fileName"), {
    onSuccess: () => onClose(),
  })

  return (
    <PageMoveModal
      queryParams={params}
      params={decodedParams}
      onProceed={moveHandler}
      onClose={onClose}
    />
  )
}

MoveScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
