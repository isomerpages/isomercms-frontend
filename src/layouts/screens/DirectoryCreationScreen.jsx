import axios from "axios"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React from "react"

import { DirectoryCreationModal } from "components/DirectoryCreationModal"

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
