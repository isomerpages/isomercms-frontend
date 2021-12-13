import { MediaAltText } from "components/media/MediaAltText"
import MediasModal from "components/media/MediasModal"
import { MediaCreationModal } from "components/MediaCreationModal/MediaCreationModal"
import _ from "lodash"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useRouteMatch } from "react-router-dom"

import { useGetDirectoryHook } from "hooks/directoryHooks/useGetDirectoryHook"
import { useCreateMediaHook } from "hooks/mediaHooks/useCreateMediaHook"

const getMediaPath = (params, fileName) => {
  const { mediaRoom, mediaDirectoryName } = params
  let path = `/${mediaRoom}`
  if (mediaDirectoryName) path += `/${mediaDirectoryName}`
  return `${path}/${fileName}`
}

const MediaModal = ({ onClose, onProceed, type }) => {
  const {
    params: { siteName },
  } = useRouteMatch()

  const [mediaMode, setMediaMode] = useState("select")

  const [queryParams, setQueryParams] = useState({ siteName, mediaRoom: type })

  const { watch, setValue } = useFormContext()

  const { data: mediasData } = useGetDirectoryHook(queryParams)
  const { mutateAsync: createHandler } = useCreateMediaHook(queryParams)

  const onMediaSelect = (media) => {
    if (watch("selectedMedia")?.name === media.name) {
      setValue("selectedMedia", {})
      setValue("selectedMediaPath", "")
    } else {
      setValue("selectedMediaPath", getMediaPath(queryParams, media.name))
      setValue("selectedMedia", media)
    }
  }

  return (
    <>
      {mediaMode === "upload" ? (
        <MediaCreationModal
          params={queryParams}
          mediasData={mediasData}
          onProceed={async (data) => {
            await createHandler(data)
            onMediaSelect(data)
            setMediaMode("select")
          }}
          onClose={onClose}
        />
      ) : mediaMode === "select" ? (
        <MediasModal
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          mediasData={mediasData}
          onUpload={() => setMediaMode("upload")}
          onProceed={() => setMediaMode("details")}
          onMediaSelect={onMediaSelect}
          onClose={onClose}
        />
      ) : mediaMode === "details" ? (
        <MediaAltText onProceed={onProceed} type={type} onClose={onClose} />
      ) : null}
    </>
  )
}

export default MediaModal

MediaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["files", "images"]).isRequired,
  readFileToStageUpload: PropTypes.func.isRequired,
  setUploadPath: PropTypes.func.isRequired,
}
