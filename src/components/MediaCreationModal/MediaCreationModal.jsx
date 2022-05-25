import { yupResolver } from "@hookform/resolvers/yup"
import { Input } from "@opengovsg/design-system-react"
import {
  MediaSettingsSchema,
  MediaSettingsModal,
} from "components/MediaSettingsModal"
import { useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"

import { useErrorToast } from "utils/toasts"
import { MEDIA_FILE_MAX_SIZE } from "utils/validators"

// eslint-disable-next-line import/prefer-default-export
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
    mode: "onTouched",
    resolver: yupResolver(MediaSettingsSchema(existingTitlesArray)),
    context: { mediaRoom },
  })

  const onMediaUpload = async (event) => {
    const mediaReader = new FileReader()
    const media = event.target?.files[0] || ""
    const errorToast = useErrorToast()
    if (media.size > MEDIA_FILE_MAX_SIZE) {
      errorToast({
        description: "File size exceeds 5MB. Please upload a different file.",
      })
    } else {
      mediaReader.onload = () => {
        methods.setValue("name", media.name)
        methods.setValue("content", mediaReader.result)
      }
      mediaReader.readAsDataURL(media)
    }
  }

  useEffect(() => {
    inputFile.current.click()
  }, [])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <>
        <Input
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
