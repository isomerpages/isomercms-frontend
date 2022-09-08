import { DirectoryData, MediaData } from "./directory"

export const isDirData = (data: unknown): data is DirectoryData => {
  return (data as DirectoryData).type === "dir"
}

// NOTE: This assumes that mediaPath is proof that this is a media file.
// The corresponding backend code (mediaFiles.js) does not appear to guarantee the existence of
// this property on media files (or indeed, ANY property) and this is a best effort attempt,
// which might fail in the future if new media files are discovered to be returned w/o mediaPath.
export const isMediaData = (data: unknown): data is MediaData => {
  return (data as MediaData).type === "file" && !!(data as MediaData).mediaPath
}
