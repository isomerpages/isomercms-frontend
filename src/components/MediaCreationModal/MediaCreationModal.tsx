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
  Progress,
  ListItem,
  UnorderedList,
  VStack,
  Flex,
} from "@chakra-ui/react"
import { Button, Infobox } from "@opengovsg/design-system-react"
import { useEffect, useState } from "react"
import { FileRejection } from "react-dropzone"
import { BiCheckCircle, BiSolidErrorCircle } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { Attachment } from "components/Attachment"

import { useCreateMultipleMedia } from "hooks/mediaHooks/useCreateMultipleMedia"

import { MediaDirectoryParams } from "types/folders"

import { Dropzone } from "./components/Dropzone"

type MediaSteps = "upload" | "progressing" | "success" | "failed"
type UploadVariant = "files" | "images"

const IMAGE_UPLOAD_ACCEPTED_MIME_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/svg+xml": [".svg"],
  "image/tiff": [".tiff", ".tif"],
  "image/bmp": [".bmp"],
}

const FILE_UPLOAD_ACCEPTED_MIME_TYPES = {
  "application/pdf": [".pdf"],
}

interface MediaDropzoneProps {
  fileRejections: FileRejection[]
  uploadedFiles: File[]
  setUploadedFiles: (files: File[]) => void
  setFileRejections: (rejections: FileRejection[]) => void
  isDisabled?: boolean
  onUpload: (files: File[]) => Promise<void>
  variant: UploadVariant
}

const MediaDropzone = ({
  fileRejections,
  uploadedFiles,
  setUploadedFiles,
  setFileRejections,
  isDisabled,
  onUpload,
  variant,
}: MediaDropzoneProps) => {
  const { onClose } = useModalContext()

  return (
    <>
      <ModalHeader>Upload files</ModalHeader>
      <ModalBody>
        <Text textStyle="body-1" mb="1.5rem">
          You can upload more than 1 file at once. Having too many files can
          slow down the site loading time, so we recommend only uploading
          necessary files to your site.
        </Text>
        <Attachment
          rejected={fileRejections}
          accept={
            variant === "files"
              ? FILE_UPLOAD_ACCEPTED_MIME_TYPES
              : IMAGE_UPLOAD_ACCEPTED_MIME_TYPES
          }
          onChange={(curUploadedFiles, rejections) => {
            setUploadedFiles([...uploadedFiles, ...curUploadedFiles])
            setFileRejections([...fileRejections, ...rejections])
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
        >{`Upload ${uploadedFiles.length} ${
          uploadedFiles.length > 1 ? "files" : "file"
        }`}</Button>
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
      <ModalHeader>Upload files</ModalHeader>
      <ModalBody>
        <Dropzone>
          <Progress
            hasStripe
            w="100%"
            value={Math.floor((cur / total) * 100)}
          />
          <Text
            textStyle="subhead-1"
            mt="1.25rem"
          >{`Uploading ${cur} of ${total} files`}</Text>
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
      <ModalHeader>Files uploaded!</ModalHeader>
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
          >{`Successfully uploaded ${numImages} files`}</Text>
        </Dropzone>
        {errorMessages.length > 0 && (
          <>
            <Flex
              alignItems="center"
              my="1rem"
              color="utility.feedback.critical"
            >
              <Icon
                as={BiSolidErrorCircle}
                fill="utility.feedback.critical"
                mr="0.5rem"
              />
              <Text textColor="utility.feedback.critical">
                {`${errorMessages.length} images failed to upload`}
              </Text>
            </Flex>
            <UnorderedList>
              {errorMessages.map((message) => {
                return (
                  <ListItem>
                    <Text textColor="utility.feedback.critical">{message}</Text>
                  </ListItem>
                )
              })}
            </UnorderedList>
          </>
        )}
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
        <Infobox variant="error">
          <VStack alignItems="flex-start" maxW="100%">
            <Text textStyle="body-1">
              {`${errorMessages.length} ${
                errorMessages.length > 1 ? "files" : "file"
              } failed to upload`}
            </Text>
            <UnorderedList maxW="100%">
              {errorMessages.map((message) => {
                return (
                  <ListItem>
                    <Text
                      maxW="100%"
                      overflowWrap="anywhere"
                      textStyle="body-1"
                    >
                      {message}
                    </Text>
                  </ListItem>
                )
              })}
            </UnorderedList>
          </VStack>
        </Infobox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Return to album</Button>
      </ModalFooter>
    </>
  )
}

interface MediaCreationModalProps {
  onClose: () => void
  variant: UploadVariant
}

interface MediaCreationRouteParams
  extends Omit<
    MediaDirectoryParams,
    "curPage" | "limit" | "mediaDirectoryName"
  > {
  mediaRoom?: string
  mediaDirectoryName?: string
}

export const MediaCreationModal = ({
  onClose,
  variant,
}: MediaCreationModalProps) => {
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
            variant={variant}
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
