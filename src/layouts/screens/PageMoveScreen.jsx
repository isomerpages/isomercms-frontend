import React from "react"
import PropTypes from "prop-types"

import { useMoveHook } from "../../hooks/moveHooks"

import MoveModal from "../../components/MoveModal"

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
