import { chakra, Icon, Text } from "@chakra-ui/react"
import { Button, BxsCloudUpload } from "@opengovsg/design-system-react"
import { DropzoneInputProps, DropzoneState } from "react-dropzone"

import { useAttachmentStyles } from "./AttachmentContext"

interface AttachmentDropzoneProps {
  inputProps: DropzoneInputProps
  isDragActive: DropzoneState["isDragActive"]
}

export const AttachmentDropzone = ({
  inputProps,
  isDragActive,
}: AttachmentDropzoneProps): JSX.Element => {
  const styles = useAttachmentStyles()

  return (
    <>
      <chakra.input {...inputProps} data-testid={inputProps.name} />
      <Icon aria-hidden as={BxsCloudUpload} __css={styles.icon} />

      {isDragActive ? (
        <Text>Drop the file here ...</Text>
      ) : (
        <>
          <Text>
            <Button variant="link" isDisabled={inputProps.disabled}>
              Choose files
            </Button>
            or drag and drop here
          </Text>
          <Text textStyle="caption-1">
            Images exceeding 5MB and videos are not supported
          </Text>
        </>
      )}
    </>
  )
}
