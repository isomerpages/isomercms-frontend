import { MediaLabels } from "types/media"

// Utility method to help ease over the various labels associated
// with the media type so that we can avoid repeated conditionals
export const getMediaLabels = (mediaType: "files" | "images"): MediaLabels => {
  if (mediaType === "files") {
    return {
      articleLabel: "a",
      singularMediaLabel: "file",
      pluralMediaLabel: "files",
      singularDirectoryLabel: "directory",
      pluralDirectoryLabel: "directories",
    }
  }

  return {
    articleLabel: "an",
    singularMediaLabel: "image",
    pluralMediaLabel: "images",
    singularDirectoryLabel: "album",
    pluralDirectoryLabel: "albums",
  }
}
