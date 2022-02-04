import axios from "axios"
import { DirectoryCreationModal } from "components/DirectoryCreationModal"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React from "react"

import {
  useGetDirectoryHook,
  useCreateDirectoryHook,
} from "hooks/directoryHooks"

// axios settings
axios.defaults.withCredentials = true

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

  return (
    <DirectoryCreationModal
      showSelectPages={!params.resourceRoomName}
      dirsData={
        pagesData
          ? dirData || []
          : dirData
          ? dirData.filter((item) => item.type == "dir")
          : []
      }
      pagesData={
        pagesData
          ? pagesData
              .filter((item) => item.name != "contact-us.md")
              .filter((item) => item.type == "file")
          : dirData
          ? dirData.filter((item) => item.type == "file")
          : []
      }
      params={decodedParams}
      onProceed={saveHandler}
      onClose={onClose}
    />
  )
}

DirectoryCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
