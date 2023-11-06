import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Icon,
  useModalContext,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { useEffect, useState } from "react"
import { FileRejection } from "react-dropzone"
import { BiCheckCircle, BiXCircle } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { Attachment } from "components/Attachment"

import { useCreateMultipleMedia } from "hooks/mediaHooks/useCreateMultipleMedia"

import { MediaDirectoryParams } from "types/folders"

import { Dropzone } from "./components/Dropzone"
import { ErrorList } from "./components/ErrorList"

type MediaSteps = "upload" | "progressing" | "success" | "failed"

interface MediaDropzoneProps {
  fileRejections: FileRejection[]
  uploadedFiles: File[]
  setUploadedFiles: (files: File[]) => void
  setFileRejections: (rejections: FileRejection[]) => void
  isDisabled?: boolean
  onUpload: (files: File[]) => Promise<void>
}

const MediaDropzone = ({
  fileRejections,
  uploadedFiles,
  setUploadedFiles,
  setFileRejections,
  isDisabled,
  onUpload,
}: MediaDropzoneProps) => {
  const { onClose } = useModalContext()

  return (
    <>
      <ModalHeader>Upload images</ModalHeader>
      <ModalBody>
        <Text textStyle="body-1" mb="1.5rem">
          You can upload more than 1 image at once. We recommend only uploading
          necessary files to your site.
        </Text>
        <Attachment
          rejected={fileRejections}
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/svg+xml": [".svg"],
            "image/tiff": [".tiff", ".tif"],
            "image/bmp": [".bmp"],
          }}
          onChange={(curUploadedFiles, rejections) => {
            setUploadedFiles(curUploadedFiles)
            setFileRejections(rejections)
          }}
          value={uploadedFiles}
          name=""
          // NOTE: 5MB - maxSize is in bytes
          maxSize={5 * 10 ** 6}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="clear" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button
          isDisabled={isDisabled}
          onClick={() => onUpload(uploadedFiles)}
        >{`Upload ${uploadedFiles.length} images`}</Button>
      </ModalFooter>
    </>
  )
}

interface UploadProgressIndicatorProps {
  cur: number
  total: number
}

const UploadProgressIndicator = ({
  cur,
  total,
}: UploadProgressIndicatorProps) => {
  const { onClose } = useModalContext()

  return (
    <>
      <ModalHeader>Uploading images</ModalHeader>
      <ModalBody>
        <Dropzone>
          <Text
            textStyle="subhead-1"
            mt="1.25rem"
          >{`Uploading ${cur} of ${total} images`}</Text>
          <Text textStyle="caption-1">
            Do not close this screen or navigate away
          </Text>
        </Dropzone>
      </ModalBody>
      <ModalFooter>
        <Button variant="clear" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isDisabled>Uploading</Button>
      </ModalFooter>
    </>
  )
}

interface ImageUploadSuccessDropzoneProps {
  numImages: number
  errorMessages: string[]
}
const ImageUploadSuccessDropzone = ({
  numImages,
  errorMessages,
}: ImageUploadSuccessDropzoneProps) => {
  const { onClose } = useModalContext()

  return (
    <>
      <ModalHeader>Success!</ModalHeader>
      <ModalBody>
        <Dropzone>
          <Icon
            fontSize="1.5rem"
            as={BiCheckCircle}
            fill="utility.feedback.success"
          />
          <Text
            textStyle="subhead-1"
            mt="1.25rem"
          >{`Successfully uploaded ${numImages} images`}</Text>
        </Dropzone>
        <ErrorList errorMessages={errorMessages} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Return to album</Button>
      </ModalFooter>
    </>
  )
}

interface ImageUploadFailedDropzoneProps {
  errorMessages: string[]
}
const ImageUploadFailedDropzone = ({
  errorMessages,
}: ImageUploadFailedDropzoneProps) => {
  const { onClose } = useModalContext()

  return (
    <>
      <ModalHeader>Upload failed</ModalHeader>
      <ModalBody>
        <Dropzone>
          <Icon
            fontSize="1.5rem"
            as={BiXCircle}
            fill="utility.feedback.critical"
          />
          <Text textStyle="subhead-1" mt="1.25rem">
            Failed to upload images
          </Text>
        </Dropzone>
        <ErrorList errorMessages={errorMessages} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Return to album</Button>
      </ModalFooter>
    </>
  )
}

interface MediaCreationModalProps {
  onClose: () => void
}

interface MediaCreationRouteParams
  extends Omit<
    MediaDirectoryParams,
    "curPage" | "limit" | "mediaDirectoryName"
  > {
  mediaRoom?: string
  mediaDirectoryName?: string
}

export const MediaCreationModal = ({ onClose }: MediaCreationModalProps) => {
  const { onClose: onModalClose } = useDisclosure()
  const params = useParams<MediaCreationRouteParams>()
  const { siteName, mediaDirectoryName } = params

  const {
    mutateAsync: uploadFiles,
    numCreated,
    numFailed,
    errorMessages,
  } = useCreateMultipleMedia(siteName, mediaDirectoryName ?? "images")

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([])
  const [curStep, setCurStep] = useState<MediaSteps>("upload")

  useEffect(() => {
    if (
      uploadedFiles.length > 0 &&
      numCreated + numFailed === uploadedFiles.length
    ) {
      setCurStep("success")
    }
  }, [numCreated, numFailed, uploadedFiles.length])

  useEffect(() => {
    // NOTE: If every upload failed,
    // we display a different modal out to the user
    // as there is no success
    if (uploadedFiles.length > 0 && uploadedFiles.length === numFailed) {
      setCurStep("failed")
    }
  }, [numFailed, uploadFiles.length, uploadedFiles.length])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Modal
      isOpen
      onClose={() => {
        onClose()
        onModalClose()
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {curStep === "upload" && (
          <MediaDropzone
            onUpload={async (mediaUploadedFiles) => {
              uploadFiles(mediaUploadedFiles)
              setCurStep("progressing")
            }}
            isDisabled={uploadedFiles.length < 1 || curStep !== "upload"}
            fileRejections={fileRejections}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            setFileRejections={setFileRejections}
          />
        )}
        {curStep === "progressing" && (
          <UploadProgressIndicator
            cur={numCreated + numFailed}
            total={uploadedFiles.length}
          />
        )}
        {curStep === "success" && (
          <ImageUploadSuccessDropzone
            numImages={numCreated}
            errorMessages={errorMessages}
          />
        )}
        {curStep === "failed" && (
          <ImageUploadFailedDropzone errorMessages={errorMessages} />
        )}
      </ModalContent>
    </Modal>
  )
}
