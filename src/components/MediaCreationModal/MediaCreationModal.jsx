import { yupResolver } from "@hookform/resolvers/yup"
import {
  MediaSettingsSchema,
  MediaSettingsModal,
} from "components/MediaSettingsModal"
import * as _ from "lodash"
import { useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"

import { errorToast } from "utils/toasts"
import { MEDIA_FILE_MAX_SIZE } from "utils/validators"

export const MediaCreationModal = ({
  params,
  mediasData = [],
  onProceed,
  onClose,
}) => {
  const { mediaRoom } = params
  const inputFile = useRef(null)

  const existingTitlesArray = mediasData.map((item) => item.name)

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(MediaSettingsSchema(existingTitlesArray)),
    context: { mediaRoom },
  })

  const onMediaUpload = async (event) => {
    const mediaReader = new FileReader()
    const media = event.target?.files[0] || ""
    if (media.size > MEDIA_FILE_MAX_SIZE) {
      errorToast("File size exceeds 5MB. Please upload a different file.")
    } else {
      mediaReader.onload = () => {
        methods.setValue("name", media.name)
        methods.setValue("content", mediaReader.result)
      }
      mediaReader.readAsDataURL(media)
    }
    event.target.value = ""
  }

  useEffect(() => {
    inputFile.current.click()
  }, [])

  return (
    <FormProvider {...methods}>
      <>
        <input
          onChange={onMediaUpload}
          ref={inputFile}
          type="file"
          id="file-upload"
          accept={
            mediaRoom === "images"
              ? "image/jpeg, image/png, image/gif, image/svg+xml, image/tiff, image/bmp, image/x-icon"
              : "application/pdf"
          }
          hidden
        />
        <MediaSettingsModal
          params={params}
          mediasData={mediasData}
          onProceed={onProceed}
          mediaRoom={mediaRoom}
          onClose={onClose}
          toggleUploadInput={() => inputFile.current.click()}
          isCreate
        />
      </>
    </FormProvider>
  )
}
