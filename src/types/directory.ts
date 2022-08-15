export type DirectoryType =
  | "mediaDirectoryName"
  | "subCollectionName"
  | "collectionName"
  | "resourceRoomName"

export interface DirectoryInfoProps {
  data: {
    items?: unknown
    newDirectoryName: string
  }
  mediaDirectoryName?: string
}

export interface DirectoryInfoReturn {
  items: DirectoryInfoProps["data"]["items"]
  newDirectoryName: string
}

export interface DirectoryData {
  name: string
  type: "dir"
  children: string[]
}

export const isDirectoryData = (data: unknown): data is DirectoryData => {
  return (data as DirectoryData).type === "dir"
}

export interface PageData {
  name: string
  title?: string
  date?: string
  type: "file"
}

export interface MediaData {
  mediaPath: string
  mediaUrl: string
  name: string
  sha: string
  type: "file"
}

// NOTE: This assumes that mediaPath is proof that this is a media file.
// The corresponding backend code (mediaFiles.js) does not appear to guarantee the existence of
// this property on media files (or indeed, ANY property) and this is a best effort attempt,
// which might fail in the future if new media files are discovered to be returned w/o mediaPath.
export const isMediaData = (data: unknown): data is MediaData => {
  return (data as MediaData).type === "file" && !!(data as MediaData).mediaPath
}

export type ResourcePageData = Required<Omit<PageData, "type">> & {
  resourceType: "file" | "post"
}
