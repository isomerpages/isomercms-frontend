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
import { getReadableFileSize } from "utils"

import { useAttachmentStyles } from "./AttachmentContext"

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
        w="100%"
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
        <Flex sx={styles.fileInfo} w="100%">
          <Icon as={BxImage} />
          <Text ml="2rem" textStyle="caption-2" noOfLines={1}>
            {file.name}
          </Text>
          <Spacer />
          <Text
            textStyle="caption-2"
            data-disabled={dataAttr(isDisabled)}
            sx={styles.fileInfoDescription}
            minW="fit-content"
            textOverflow="ellipsis"
          >
            {readableFileSize}
          </Text>
        </Flex>
      </Flex>
    )
  }
)

AttachmentFileInfo.displayName = "AttachmentFileInfo"
