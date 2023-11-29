import PropTypes from "prop-types"
import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useRouteMatch } from "react-router-dom"

import { MediaAltText } from "components/media/MediaAltText"
import MediasSelectModal from "components/media/MediasSelectModal"
import { MediaCreationModal } from "components/MediaCreationModal/MediaCreationModal"

import { getMediaDirectoryName } from "utils/media"

const MediaModal = ({
  onClose,
  onProceed,
  type,
  showAltTextModal = false,
  onExternalProceed,
}) => {
  const {
    params: { siteName },
  } = useRouteMatch()

  const methods = useForm({
    mode: "onTouched",
  })

  const [mediaMode, setMediaMode] = useState("select")
  const [queryParams, setQueryParams] = useState({
    siteName,
    mediaRoom: type,
    mediaDirectoryName: type,
  })

  const retrieveMediaDirectoryParams = () =>
    `/${getMediaDirectoryName(queryParams.mediaDirectoryName, {
      joinOn: "/",
    })}`

  const onMediaSelect = (media) => {
    if (!media) {
      methods.setValue("selectedMedia", undefined)
      methods.setValue("selectedMediaPath", "")
      return
    }
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
          onProceed={() => setMediaMode("select")}
          onClose={() => setMediaMode("select")}
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
          allowExternal={showAltTextModal}
          onExternalProceed={onExternalProceed}
          onMediaSelect={onMediaSelect}
          onClose={onClose}
          mediaType={type}
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
  onExternalProceed: PropTypes.func,
}
