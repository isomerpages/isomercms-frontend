import axios from "axios"
import { DirectoryCreationModal } from "components/DirectoryCreationModal"
import PropTypes from "prop-types"

import {
  useGetDirectoryHook,
  useCreateDirectoryHook,
} from "hooks/directoryHooks"

// axios settings
axios.defaults.withCredentials = true

// eslint-disable-next-line import/prefer-default-export
export const DirectoryCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { data: dirData } = useGetDirectoryHook(params, { initialData: [] })
  const { mutateAsync: saveHandler } = useCreateDirectoryHook(params)
  const { data: pagesData } = useGetDirectoryHook(
    {
      ...params,
      isUnlinked: true,
    },
    { enabled: !params.collectionName }
  )

  const getDirsData = () => {
    if (pagesData) {
      return dirData || []
    }

    if (dirData) {
      return dirData.filter((item) => item.type === "dir")
    }

    return []
  }

  const getPagesData = () => {
    if (pagesData) {
      return pagesData
        .filter((item) => item.name !== "contact-us.md")
        .filter((item) => item.type === "file")
    }

    if (dirData) {
      dirData.filter((item) => item.type === "file")
    }

    return []
  }

  return (
    <DirectoryCreationModal
      showSelectPages={!params.resourceRoomName}
      dirsData={getDirsData()}
      pagesData={getPagesData()}
      params={decodedParams}
      onProceed={saveHandler}
      onClose={onClose}
    />
  )
}

DirectoryCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
