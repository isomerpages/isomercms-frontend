import React from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"

import { useMoveHook } from "../../hooks/moveHooks"

import MoveModal from "../../components/MoveModal"

export const FoldersPageMoveScreen = ({ onClose }) => {
  const params = useParams()

  const { mutateAsync: moveHandler } = useMoveHook(
    (({ fileName, ...p }) => p)(params),
    {
      onSuccess: () => onClose(),
    }
  )

  return <MoveModal params={params} onProceed={moveHandler} onClose={onClose} />
}

FoldersPageMoveScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
