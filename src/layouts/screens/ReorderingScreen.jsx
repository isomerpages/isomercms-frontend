import ReorderingModal from "components/folders/ReorderingModal"
import PropTypes from "prop-types"

import { useGetFolders, useReorderDirectoryHook } from "hooks/directoryHooks"

export const ReorderingScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match
  const { data: dirData } = useGetFolders(params, { initialData: [] })
  const { mutateAsync: reorderHandler } = useReorderDirectoryHook(params, {
    onSettled: onClose,
  })

  return (
    <ReorderingModal
      dirData={dirData}
      onProceed={reorderHandler}
      params={decodedParams}
      onClose={onClose}
    />
  )
}

ReorderingScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
