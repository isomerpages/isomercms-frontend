import { yupResolver } from "@hookform/resolvers/yup"
import PropTypes from "prop-types"
import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useRouteMatch } from "react-router-dom"
import * as Yup from "yup"

import { MediaAltText } from "components/media/MediaAltText"
import MediasSelectModal from "components/media/MediasSelectModal"
import { MediaCreationModal } from "components/MediaCreationModal/MediaCreationModal"

import { useCreateMediaHook } from "hooks/mediaHooks/useCreateMediaHook"

import { getMediaDirectoryName } from "utils"

const MediaModal = ({ onClose, onProceed, type, showAltTextModal = false }) => {
  const {
    params: { siteName },
  } = useRouteMatch()

  const methods = useForm({
    mode: "onTouched",
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

  const { mutateAsync: createHandler } = useCreateMediaHook(queryParams)

  const retrieveMediaDirectoryParams = () =>
    `/${getMediaDirectoryName(queryParams.mediaDirectoryName, {
      joinOn: "/",
    })}`

  const onMediaSelect = (media) => {
    if (methods.watch("selectedMedia")?.name === media.name) {
      methods.setValue("selectedMedia", undefined)
      methods.setValue("selectedMediaPath", "")
    } else {
      methods.setValue(
        "selectedMediaPath",
        `${retrieveMediaDirectoryParams()}/${media.name}`
      )
      methods.setValue("selectedMedia", media)
    }
  }

  // Returns the appropriate modal type based on the media mode.
  // This defaults to null if no conditions fit.
  const getModal = () => {
    if (mediaMode === "upload") {
      return (
        <MediaCreationModal
          params={queryParams}
          variant={queryParams.mediaRoom}
          onProceed={async ({ data }) => {
            await createHandler({ data })
            onMediaSelect({ ...data, mediaUrl: data.content })
            if (showAltTextModal) setMediaMode("details")
            else
              onProceed({
                selectedMediaPath: `${retrieveMediaDirectoryParams()}/${
                  data.name
                }`,
              })
          }}
          onClose={onClose}
        />
      )
    }

    if (mediaMode === "select") {
      return (
        <MediasSelectModal
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onUpload={() => setMediaMode("upload")}
          onProceed={
            showAltTextModal ? () => setMediaMode("details") : onProceed
          }
          onMediaSelect={onMediaSelect}
          onClose={onClose}
        />
      )
    }

    return showAltTextModal && mediaMode === "details" ? (
      <MediaAltText onProceed={onProceed} type={type} onClose={onClose} />
    ) : null
  }
  return <FormProvider {...methods}>{getModal()}</FormProvider>
}

export default MediaModal

MediaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["files", "images"]).isRequired,
  showAltTextModal: PropTypes.bool,
}
