import axios from "axios"
import { DirectoryCreationModal } from "components/DirectoryCreationModal"
import PropTypes from "prop-types"

import { useGetDirectoryHook } from "hooks/directoryHooks"

// axios settings
axios.defaults.withCredentials = true

const getDirsData = (pagesData, dirData) => {
  if (pagesData) {
    return dirData || []
  }

  if (dirData) {
    return dirData.filter((item) => item.type === "dir")
  }

  return []
}

const getPagesData = (pagesData, dirData) => {
  if (pagesData)
    return pagesData
      .filter((item) => item.name !== "contact-us.md")
      .filter((item) => item.type === "file")

  if (dirData) return dirData.filter((item) => item.type === "file")

  return []
}

// eslint-disable-next-line import/prefer-default-export
export const DirectoryCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { data: dirData } = useGetDirectoryHook(params, { initialData: [] })
  const { data: pagesData } = useGetDirectoryHook(
    {
      ...params,
      isUnlinked: true,
    },
    { enabled: !params.collectionName }
  )

  return (
    <DirectoryCreationModal
      showSelectPages={!params.resourceRoomName}
      dirsData={getDirsData(pagesData, dirData)}
      pagesData={getPagesData(pagesData, dirData)}
      params={decodedParams}
      onClose={onClose}
    />
  )
}

DirectoryCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
