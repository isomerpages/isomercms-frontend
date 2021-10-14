import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
import * as _ from "lodash"

import {
  useGetDirectoryHook,
  useCreateDirectoryHook,
} from "../../hooks/directoryHooks"

import DirectoryCreationModal from "../../components/DirectoryCreationModal"

// axios settings
axios.defaults.withCredentials = true

export const DirectoryCreationScreen = ({ match, onClose }) => {
  const { params, decodedParams } = match

  const { data: dirData } = useGetDirectoryHook(params, { initialData: [] })
  const { mutateAsync: saveHandler } = useCreateDirectoryHook(params)

  return (
    <DirectoryCreationModal
      dirData={dirData}
      params={decodedParams}
      onProceed={saveHandler}
      onClose={onClose}
    />
  )
}

DirectoryCreationScreen.propTypes = {
  onClose: PropTypes.func.isRequired,
}
