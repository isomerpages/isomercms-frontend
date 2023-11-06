import { AxiosError } from "axios"
import { useState } from "react"
import { UseMutationResult, useMutation, useQueryClient } from "react-query"

import { LIST_MEDIA_DIRECTORY_FILES_KEY } from "constants/queryKeys"

import * as MediaFileService from "services/MediaFileService"

import { getAxiosErrorMessage } from "utils/axios"

import { MediaData } from "types/directory"
import { getFileExt, getFileName } from "utils"

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const useCreateMultipleMedia = (
  siteName: string,
  mediaDirectoryName: string
): UseMutationResult<MediaData[], AxiosError, File[]> & {
  numCreated: number
  numFailed: number
  errorMessages: string[]
} => {
  const queryClient = useQueryClient()
  const [numCreated, setNumCreated] = useState(0)
  const [numFailed, setNumFailed] = useState(0)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const res: UseMutationResult<MediaData[], AxiosError, File[]> = useMutation(
    // data -> sha, name, content
    // content is data url
    async (files) => {
      const updatedFiles: MediaData[] = []

      const mediaData = await Promise.all(
        files.map(async (file) => ({
          content: await readFile(file),
          // NOTE: Replace all non-word and whitespace
          // with a safe replacement character
          newFileName: `${getFileName(file.name)
            .replaceAll(/[\W\s]/g, "_")
            .trim()}.${getFileExt(file.name)}`,
        }))
      )

      await mediaData.reduce((acc, cur) => {
        return acc
          .then(() => {
            return MediaFileService.createMediaFile(
              siteName,
              mediaDirectoryName,
              cur
            )
          })
          .then((data) => {
            updatedFiles.push(data)
            setNumCreated((prev) => prev + 1)
          })
          .catch((axiosError) => {
            setNumFailed((prev) => prev + 1)
            setErrorMessages((prev) => [
              ...prev,
              getAxiosErrorMessage(axiosError),
            ])
          })
          .then(() =>
            queryClient.invalidateQueries([
              // invalidates media directory
              LIST_MEDIA_DIRECTORY_FILES_KEY,
              { siteName, mediaDirectoryName },
            ])
          )
          .finally(() => new Promise((resolve) => setTimeout(resolve, 500)))
      }, Promise.resolve())
      return updatedFiles
    }
  )

  return { ...res, numCreated, numFailed, errorMessages }
}
