import { yupResolver } from "@hookform/resolvers/yup"
import { MediaAltText } from "components/media/MediaAltText"
import MediasSelectModal from "components/media/MediasSelectModal"
import { MediaCreationModal } from "components/MediaCreationModal/MediaCreationModal"
import { useCreateMediaHook } from "hooks/mediaHooks/useCreateMediaHook"
import _ from "lodash"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useRouteMatch } from "react-router-dom"
import * as Yup from "yup"

import { useGetDirectoryHook } from "hooks/directoryHooks/useGetDirectoryHook"

import { getMediaDirectoryName } from "utils"

const MediaModal = ({ onClose, onProceed, type, showAltTextModal = false }) => {
  const {
    params: { siteName },
  } = useRouteMatch()

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object({
        altText: Yup.string()
          // .required("Alt text is required")
          .max(100, "Alt text should be less than 100 characters"),
      })
    ),
  })

  const [mediaMode, setMediaMode] = useState("select")
  const [queryParams, setQueryParams] = useState({
    siteName,
    mediaRoom: type,
    mediaDirectoryName: type,
  })

  const { data: mediasData } = useGetDirectoryHook(queryParams)
  const { mutateAsync: createHandler } = useCreateMediaHook(queryParams)

  const onMediaSelect = (media) => {
    if (methods.watch("selectedMedia")?.name === media.name) {
      methods.setValue("selectedMedia", {})
      methods.setValue("selectedMediaPath", "")
    } else {
      methods.setValue(
        "selectedMediaPath",
        `/${getMediaDirectoryName(queryParams.mediaDirectoryName, {
          joinOn: "/",
        })}/${media.name}`
      )
      methods.setValue("selectedMedia", media)
    }
  }

  return (
    <FormProvider {...methods}>
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
        <MediasSelectModal
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          mediasData={mediasData}
          onUpload={() => setMediaMode("upload")}
          onProceed={
            showAltTextModal ? () => setMediaMode("details") : onProceed
          }
          onMediaSelect={onMediaSelect}
          onClose={onClose}
        />
      ) : showAltTextModal && mediaMode === "details" ? (
        <MediaAltText onProceed={onProceed} type={type} onClose={onClose} />
      ) : null}
    </FormProvider>
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
