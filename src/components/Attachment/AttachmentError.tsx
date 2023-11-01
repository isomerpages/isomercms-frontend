import {
  Flex,
  forwardRef,
  Icon,
  Image,
  Spacer,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react"
import { dataAttr } from "@chakra-ui/utils"
import { useEffect, useMemo, useState } from "react"
import { FileRejection } from "react-dropzone"

import { BxError } from "assets"

import { useAttachmentStyles } from "./AttachmentContext"
import { getReadableFileSize } from "./utils"

const getErrorMessage = (rejection: FileRejection): string => {
  const { errors } = rejection
  const displayedError = errors.reduce((acc, error) => {
    // Preferentially display invalid, then size exceeded
    if (acc.code === "file-invalid-type" || error.code === "file-invalid-type")
      return {
        code: "file-invalid-type",
        message: "Invalid file type",
      }

    if (error.code === "file-too-large" && acc.code !== "file-invalid-type")
      return error

    return error
  })
  return displayedError.message
}

export interface AttachmentErrorProps {
  fileRejection: FileRejection
  imagePreview?: "small" | "large"
  isDisabled?: boolean
}

export const AttachmentError = forwardRef<AttachmentErrorProps, "div">(
  ({ fileRejection, imagePreview, isDisabled }, ref) => {
    const { file } = fileRejection
    const [previewSrc, setPreviewSrc] = useState("")
    const styles = useAttachmentStyles()
    const readableFileSize = useMemo(() => getReadableFileSize(file.size), [
      file.size,
    ])

    useEffect(() => {
      let objectUrl = ""
      // create the preview
      if (file.type.startsWith("image/")) {
        objectUrl = URL.createObjectURL(file)
        setPreviewSrc(objectUrl)
      }

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    return (
      <Flex
        aria-disabled={isDisabled}
        ref={ref}
        tabIndex={0}
        sx={styles.fileInfoContainer}
      >
        <VisuallyHidden>
          File attached: {file.name} with file size of {readableFileSize}
        </VisuallyHidden>
        {imagePreview && previewSrc && (
          <Image
            alt="uploaded image preview"
            sx={styles.fileInfoImage}
            src={previewSrc}
          />
        )}
        <Flex sx={styles.fileInfo}>
          <Icon as={BxError} />
          <Text ml="2rem">{file.name}</Text>
          <Spacer />
          <Text
            data-disabled={dataAttr(isDisabled)}
            sx={styles.fileInfoDescription}
          >
            {getErrorMessage(fileRejection)}
          </Text>
        </Flex>
      </Flex>
    )
  }
)

AttachmentError.displayName = "AttachmentFileInfo"
