import { yupResolver } from "@hookform/resolvers/yup"
import { Input } from "@opengovsg/design-system-react"
import {
  MediaSettingsSchema,
  MediaSettingsModal,
} from "components/MediaSettingsModal"
import { useEffect, useRef, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"

import { useErrorToast } from "utils/toasts"
import { MEDIA_FILE_MAX_SIZE } from "utils/validators"

import { getFileExt, getFileName } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const MediaCreationModal = ({
  params,
  mediasData = [],
  onProceed,
  onClose,
}) => {
  const { mediaRoom } = params
  const inputFile = useRef(null)
  const errorToast = useErrorToast()

  const existingTitlesArray = mediasData.map((item) => getFileName(item.name))
  const [fileExt, setFileExt] = useState("")

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(MediaSettingsSchema(existingTitlesArray)),
    context: { mediaRoom, isCreate: true },
  })

  const onMediaUpload = async (event) => {
    const mediaReader = new FileReader()
    const media = event.target?.files[0] || ""
    if (media.size > MEDIA_FILE_MAX_SIZE) {
      errorToast({
        description: "File size exceeds 5MB. Please upload a different file.",
      })
    } else {
      mediaReader.onload = () => {
        const fileName = getFileName(media.name)
        setFileExt(getFileExt(media.name))
        methods.setValue("name", fileName)
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
          onProceed={(submissionData) => {
            return onProceed({
              data: {
                ...submissionData.data,
                name: `${submissionData.data.name}.${fileExt}`,
              },
            })
          }}
          mediaRoom={mediaRoom}
          onClose={onClose}
          toggleUploadInput={() => inputFile.current.click()}
          isCreate
        />
      </>
    </FormProvider>
  )
}
