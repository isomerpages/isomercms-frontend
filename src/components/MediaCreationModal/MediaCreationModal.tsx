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
import _ from "lodash"
import { useEffect, useState } from "react"
import { FileRejection } from "react-dropzone"
import { BiCheckCircle, BiSolidErrorCircle } from "react-icons/bi"

import { Attachment } from "components/Attachment"

import { useCreateMultipleMedia } from "hooks/mediaHooks/useCreateMultipleMedia"

import { getMediaDirectoryName, getMediaLabels } from "utils/media"

import { MediaDirectoryParams } from "types/folders"
import { MediaFolderTypes } from "types/media"
import { MEDIA_FILE_MAX_SIZE } from "utils"

import { Dropzone } from "./components/Dropzone"

type MediaSteps = "upload" | "progressing" | "success" | "failed"

const IMAGE_UPLOAD_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
]

const FILE_UPLOAD_ACCEPTED_MIME_TYPES = ["application/pdf"]

interface MediaDropzoneProps {
  fileRejections: FileRejection[]
  uploadedFiles: File[]
  setUploadedFiles: (files: File[]) => void
  setFileRejections: (rejections: FileRejection[]) => void
  isDisabled?: boolean
  onUpload: (files: File[]) => Promise<void>
  mediaType: MediaFolderTypes
}

const MediaDropzone = ({
  fileRejections,
  uploadedFiles,
  setUploadedFiles,
  setFileRejections,
  isDisabled,
  onUpload,
  mediaType,
}: MediaDropzoneProps) => {
  const { onClose } = useModalContext()
  const { singularMediaLabel, pluralMediaLabel } = getMediaLabels(mediaType)

  return (
    <>
      <ModalHeader>Upload {pluralMediaLabel}</ModalHeader>
      <ModalBody>
        <Text textStyle="body-1" mb="1.5rem">
          You can upload more than 1 {singularMediaLabel} at once. Having too
          many {pluralMediaLabel} can slow down the site loading time, so we
          recommend only uploading necessary {pluralMediaLabel} to your site.
        </Text>
        <Attachment
          rejected={fileRejections}
          accept={
            mediaType === "files"
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
          maxSize={MEDIA_FILE_MAX_SIZE}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="clear" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isDisabled={isDisabled} onClick={() => onUpload(uploadedFiles)}>
          {`Upload ${uploadedFiles.length} ${
            uploadedFiles.length === 1 ? singularMediaLabel : pluralMediaLabel
          }`}
        </Button>
      </ModalFooter>
    </>
  )
}

interface UploadProgressIndicatorProps {
  cur: number
  total: number
  mediaType: MediaFolderTypes
}

const UploadProgressIndicator = ({
  cur,
  total,
  mediaType,
}: UploadProgressIndicatorProps) => {
  const { onClose } = useModalContext()
  const { pluralMediaLabel } = getMediaLabels(mediaType)

  return (
    <>
      <ModalHeader>Upload {pluralMediaLabel}</ModalHeader>
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
          >{`Uploading ${cur} of ${total} ${pluralMediaLabel}`}</Text>
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

interface MediaUploadSuccessDropzoneProps {
  numMedia: number
  errorMessages: string[]
  mediaType: MediaFolderTypes
  onProceed: () => void
}
const MediaUploadSuccessDropzone = ({
  numMedia,
  errorMessages,
  mediaType,
  onProceed,
}: MediaUploadSuccessDropzoneProps) => {
  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
  } = getMediaLabels(mediaType)

  return (
    <>
      <ModalHeader>
        {_.upperFirst(numMedia === 1 ? singularMediaLabel : pluralMediaLabel)}{" "}
        uploaded!
      </ModalHeader>
      <ModalBody>
        <Dropzone>
          <Icon
            fontSize="1.5rem"
            as={BiCheckCircle}
            fill="utility.feedback.success"
          />
          <Text textStyle="subhead-1" mt="1.25rem">
            {`Successfully uploaded ${numMedia} ${
              numMedia === 1 ? singularMediaLabel : pluralMediaLabel
            }`}
          </Text>
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
                {`${errorMessages.length} ${pluralMediaLabel} failed to upload`}
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
        <Button onClick={onProceed}>Return to {singularDirectoryLabel}</Button>
      </ModalFooter>
    </>
  )
}

interface MediaUploadFailedDropzoneProps {
  errorMessages: string[]
  mediaType: MediaFolderTypes
}
const MediaUploadFailedDropzone = ({
  errorMessages,
  mediaType,
}: MediaUploadFailedDropzoneProps) => {
  const { onClose } = useModalContext()
  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
  } = getMediaLabels(mediaType)

  return (
    <>
      <ModalHeader>Upload failed</ModalHeader>
      <ModalBody>
        <Infobox variant="error">
          <VStack alignItems="flex-start" maxW="100%">
            <Text textStyle="body-1">
              {`${errorMessages.length} ${
                errorMessages.length === 1
                  ? singularMediaLabel
                  : pluralMediaLabel
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
        <Button onClick={onClose}>Return to {singularDirectoryLabel}</Button>
      </ModalFooter>
    </>
  )
}

interface MediaCreationRouteParams
  extends Omit<
    MediaDirectoryParams,
    "curPage" | "limit" | "mediaDirectoryName"
  > {
  mediaRoom?: string
  mediaDirectoryName?: string
}

interface MediaCreationModalProps {
  params: MediaCreationRouteParams
  onClose: () => void
  onProceed: () => void
  variant: MediaFolderTypes
}

export const MediaCreationModal = ({
  params,
  onClose,
  onProceed,
  variant,
}: MediaCreationModalProps) => {
  const { onClose: onModalClose } = useDisclosure()
  const { siteName, mediaDirectoryName: rawMediaDirectoryName } = params
  const mediaDirectoryName = `${getMediaDirectoryName(
    rawMediaDirectoryName || "",
    { splitOn: "/" }
  )}`

  const {
    mutateAsync: uploadFiles,
    numCreated,
    numFailed,
    errorMessages,
  } = useCreateMultipleMedia(siteName, mediaDirectoryName ?? variant)

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
            mediaType={variant}
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
            mediaType={variant}
          />
        )}
        {curStep === "success" && (
          <MediaUploadSuccessDropzone
            numMedia={numCreated}
            errorMessages={errorMessages}
            mediaType={variant}
            onProceed={onProceed}
          />
        )}
        {curStep === "failed" && (
          <MediaUploadFailedDropzone
            errorMessages={errorMessages}
            mediaType={variant}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
