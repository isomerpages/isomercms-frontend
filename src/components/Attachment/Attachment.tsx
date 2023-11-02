import {
  Box,
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
import { DropzoneProps, useDropzone } from "react-dropzone"
import type { Promisable } from "type-fest"

import { getFileExt } from "utils"

import { AttachmentStylesProvider } from "./AttachmentContext"
import { AttachmentDropzone } from "./AttachmentDropzone"
import { AttachmentFileInfo } from "./AttachmentFileInfo"
import { getReadableFileSize } from "./utils"

export interface AttachmentProps extends UseFormControlProps<HTMLElement> {
  /**
   * Callback to be invoked when the file is attached or removed.
   */
  onChange: (file?: File) => void
  /**
   * If exists, callback to be invoked when file has errors.
   */
  onError?: (errMsg: string) => void
  /**
   * Current value of the input.
   */
  value: File | undefined
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
}

export const Attachment = forwardRef<AttachmentProps, "div">(
  (
    {
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
      if (showMaxSize) {
        describedByIds.add(maxSizeTextId)
      }

      // Remove helptext, since label should already consist of the text
      describedByIds.delete(`${inputProps.id}-helptext`)

      return Array.from(describedByIds).filter(Boolean).join(" ").trim()
    }, [inputProps, maxSizeTextId, showMaxSize])

    const handleFileDrop = useCallback<NonNullable<DropzoneProps["onDrop"]>>(
      async ([acceptedFile], rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          const firstError = rejectedFiles[0].errors[0]
          let errorMessage
          switch (firstError.code) {
            case "file-invalid-type": {
              const fileExt = getFileExt(rejectedFiles[0].file.name)
              errorMessage = `Your file's extension ending in *${fileExt} is not allowed`
              break
            }
            case "too-many-files": {
              errorMessage = "You can only upload a single file in this input"
              break
            }
            default:
              errorMessage = firstError.message
          }
          return onError?.(errorMessage)
        }
        const fileValidationErrorMessage = await onFileValidation?.(
          acceptedFile
        )
        if (fileValidationErrorMessage) {
          return onError?.(fileValidationErrorMessage)
        }

        return onChange(acceptedFile)
      },
      [onChange, onError, onFileValidation]
    )

    const fileValidator = useCallback<NonNullable<DropzoneProps["validator"]>>(
      (file) => {
        if (maxSize && file.size > maxSize) {
          return {
            code: "file-too-large",
            message: `You have exceeded the limit, please upload a file below ${readableMaxSize}`,
          }
        }
        return null
      },
      [maxSize, readableMaxSize]
    )

    const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
      multiple: false,
      accept,
      disabled: inputProps.disabled,
      validator: fileValidator,
      noKeyboard: inputProps.readOnly || value !== undefined,
      noClick: inputProps.readOnly || value !== undefined,
      noDrag: inputProps.readOnly || value !== undefined,
      onDrop: handleFileDrop,
    })

    const mergedRefs = useMergeRefs(rootRef, ref)

    const styles = useMultiStyleConfig("Attachment", {
      isDragActive,
      colorScheme,
      imagePreview,
    })

    const handleRemoveFile = useCallback(() => {
      onChange(undefined)
      rootRef.current?.focus()
    }, [onChange, rootRef])

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
            __css={value ? undefined : styles.dropzone}
          >
            {value ? (
              <AttachmentFileInfo
                file={value}
                imagePreview={imagePreview}
                handleRemoveFile={handleRemoveFile}
                isDisabled={inputProps.disabled}
                isReadOnly={inputProps.readOnly}
              />
            ) : (
              <AttachmentDropzone
                isDragActive={isDragActive}
                inputProps={processedInputProps}
              />
            )}
          </Box>
          {showMaxSize ? (
            <Text
              id={maxSizeTextId}
              color="base.content.medium"
              mt="0.5rem"
              textStyle="body-2"
            >
              Maximum file size: {readableMaxSize}
            </Text>
          ) : null}
        </Box>
      </AttachmentStylesProvider>
    )
  }
)

Attachment.displayName = "Attachment"
