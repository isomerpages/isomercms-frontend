import {
  Box,
  Divider,
  forwardRef,
  Text,
  ThemingProps,
  useFormControl,
  UseFormControlProps,
  useMergeRefs,
  useMultiStyleConfig,
} from "@chakra-ui/react"
import { dataAttr } from "@chakra-ui/utils"
import { omit } from "lodash"
import { useCallback, useMemo } from "react"
import { DropzoneProps, FileRejection, useDropzone } from "react-dropzone"
import type { Promisable } from "type-fest"

import { getReadableFileSize } from "utils"

import { AttachmentStylesProvider } from "./AttachmentContext"
import { AttachmentDropzone } from "./AttachmentDropzone"
import { AttachmentError } from "./AttachmentError"
import { AttachmentFileInfo } from "./AttachmentFileInfo"

export interface AttachmentProps extends UseFormControlProps<HTMLElement> {
  /**
   * Callback to be invoked when the file is attached or removed.
   */
  onChange: (files: File[], rejections: FileRejection[]) => void
  /**
   * If exists, callback to be invoked when file has errors.
   */
  onError?: (errMsg: string) => void
  /**
   * Current value of the input.
   */
  value: File[]
  /**
   * Name of the input.
   */
  name: string
  /**
   * One or more
   * [unique file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers)
   * describing file types to allow
   */
  accept?: DropzoneProps["accept"]
  /**
   * If exists, files cannot be attached if they are above the maximum size
   * (in bytes).
   */
  maxSize?: DropzoneProps["maxSize"]
  /**
   * Boolean flag on whether to show the file size helper message below the
   * input.
   */
  showFileSize?: boolean

  /**
   * If provided, the image preview will be shown in the given size variant.
   */
  imagePreview?: "small" | "large"

  /**
   * Color scheme of the component.
   */
  colorScheme?: ThemingProps<"Attachment">["colorScheme"]

  /**
   * If provided, the file will be validated against the given function.
   * If the function returns a string, the file will be considered invalid
   * and the string will be used as the error message.
   * If the function returns null, the file will be considered valid.
   */
  onFileValidation?: (file: File) => Promisable<string | null>
  rejected: FileRejection[]
}

export const Attachment = forwardRef<AttachmentProps, "div">(
  (
    {
      // TODO: Add back functionality for
      // `onError` and `onFileValidation`
      onChange,
      onError,
      maxSize,
      showFileSize,
      accept,
      value,
      name,
      colorScheme,
      imagePreview,
      onFileValidation,
      rejected,
      ...props
    },
    ref
  ) => {
    // Merge given props with any form control props, if they exist.
    const inputProps = useFormControl(props)
    // id to set on the rendered max size FormHelperText component.
    const maxSizeTextId = useMemo(() => `${name}-max-size`, [name])

    const readableMaxSize = useMemo(
      () => (maxSize ? getReadableFileSize(maxSize) : undefined),
      [maxSize]
    )

    const showMaxSize = useMemo(
      () => !value && showFileSize && readableMaxSize,
      [value, readableMaxSize, showFileSize]
    )

    const ariaDescribedBy = useMemo(() => {
      const describedByIds = new Set<string>()
      // Must be in this order so the screen reader reads out something coherent.
      // 1. Label text (if available)
      // 2. Initial describedby text (if available)
      // 3. Max size text (if prop is true)
      if (inputProps.id) {
        describedByIds.add(`${inputProps.id}-label`)
      }
      inputProps["aria-describedby"]
        ?.split(" ")
        .map((id) => describedByIds.add(id))

      if (showMaxSize) describedByIds.add(maxSizeTextId)

      // Remove helptext, since label should already consist of the text
      describedByIds.delete(`${inputProps.id}-helptext`)

      return Array.from(describedByIds).filter(Boolean).join(" ").trim()
    }, [inputProps, maxSizeTextId, showMaxSize])

    const handleFileDrop = useCallback<NonNullable<DropzoneProps["onDrop"]>>(
      async (acceptedFiles, rejectedFiles) => {
        onChange(acceptedFiles, rejectedFiles)
      },
      [onChange]
    )

    const fileValidator = useCallback<NonNullable<DropzoneProps["validator"]>>(
      (file) => {
        if (maxSize && file.size > maxSize) {
          return {
            code: "file-too-large",
            message: `Upload too big (${getReadableFileSize(file.size)})`,
          }
        }
        return null
      },
      [maxSize]
    )

    const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
      accept,
      disabled: inputProps.disabled,
      validator: fileValidator,
      onDrop: handleFileDrop,
      multiple: true,
    })

    const mergedRefs = useMergeRefs(rootRef, ref)

    const styles = useMultiStyleConfig("Attachment", {
      isDragActive,
      colorScheme,
      imagePreview,
    })

    // Bunch of memoization to avoid unnecessary re-renders.
    const processedRootProps = useMemo(() => {
      return getRootProps({
        // Root div does not need id prop, prevents duplicate ids.
        ...omit(inputProps, "id"),
        // Bunch of extra work to prevent field from being used when in readOnly
        // state.
        onKeyDown: (e) => {
          if (inputProps.readOnly) {
            e.stopPropagation()
          }
        },
        "aria-describedby": ariaDescribedBy,
      })
    }, [ariaDescribedBy, getRootProps, inputProps])

    const processedInputProps = useMemo(() => {
      return getInputProps({
        name,
        ...inputProps,
      })
    }, [getInputProps, inputProps, name])

    return (
      <AttachmentStylesProvider value={styles}>
        <Box __css={styles.container}>
          <Box
            {...processedRootProps}
            ref={mergedRefs}
            data-active={dataAttr(isDragActive)}
            __css={styles.dropzone}
          >
            <AttachmentDropzone
              isDragActive={isDragActive}
              inputProps={processedInputProps}
            />
          </Box>
          {showMaxSize && (
            <Text
              id={maxSizeTextId}
              color="base.content.medium"
              mt="0.5rem"
              textStyle="body-2"
            >
              Maximum size per file: {readableMaxSize}
            </Text>
          )}
        </Box>
        <Box mt="1.5rem" mb="0.75rem">
          <Text textStyle="subhead-1">Selected images</Text>
          <Text textStyle="caption-2">{`${value.length}/5 images can be uploaded`}</Text>
        </Box>
        {value?.map((file) => (
          <>
            <Divider />
            <AttachmentFileInfo
              file={file}
              imagePreview={imagePreview}
              isDisabled={inputProps.disabled}
            />
          </>
        ))}
        <Box overflowY="auto" maxH="25vh">
          {rejected?.map((fileRejection) => (
            <>
              <Divider />
              <AttachmentError fileRejection={fileRejection} />
            </>
          ))}
        </Box>
        {/* NOTE: Add last divider if we have content above */}
        {(value?.length > 0 || rejected.length > 0) && <Divider />}
      </AttachmentStylesProvider>
    )
  }
)

Attachment.displayName = "Attachment"
