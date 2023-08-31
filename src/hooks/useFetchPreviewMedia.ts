import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { getImageDetails } from "utils/images"

import { useGetMediaHook } from "./mediaHooks"

export const useFetchPreviewMedia = (imageUrl = ""): string => {
  const { siteName } = useParams<{ siteName: string }>()
  const [loadedImageURL, setLoadedImageURL] = useState(imageUrl)
  const { fileName, imageDirectory } = getImageDetails(imageUrl)
  const { data: mediaData } = useGetMediaHook({
    siteName,
    mediaDirectoryName: imageDirectory || "images",
    fileName,
  })

  useEffect(() => {
    if (mediaData) {
      setLoadedImageURL(mediaData.mediaUrl)
    }
  }, [mediaData])

  return loadedImageURL
}
