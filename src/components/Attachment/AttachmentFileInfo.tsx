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

import { BxImage } from "assets"

import { useAttachmentStyles } from "./AttachmentContext"
import { getReadableFileSize } from "./utils"

export interface AttachmentFileInfoProps {
  file: File
  imagePreview?: "small" | "large"
  isDisabled?: boolean
}

export const AttachmentFileInfo = forwardRef<AttachmentFileInfoProps, "div">(
  ({ file, imagePreview, isDisabled }, ref) => {
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
          <Icon as={BxImage} />
          <Text ml="2rem">{file.name}</Text>
          <Spacer />
          <Text
            data-disabled={dataAttr(isDisabled)}
            sx={styles.fileInfoDescription}
          >
            {readableFileSize}
          </Text>
        </Flex>
      </Flex>
    )
  }
)

AttachmentFileInfo.displayName = "AttachmentFileInfo"
