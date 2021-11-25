import PropTypes from "prop-types"
import React from "react"

import MoveModal from "components/MoveModal"

import { useMoveHook } from "hooks/moveHooks"

export const PageMoveScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { mutateAsync: moveHandler } = useMoveHook(
    (({ fileName, ...p }) => p)(params),
    {
      onSuccess: () => onClose(),
    }
  )

  return (
    <MoveModal
      queryParams={params}
      params={decodedParams}
      onProceed={moveHandler}
      onClose={onClose}
    />
  )
}

PageMoveScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
