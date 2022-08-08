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

export type ResourcePageData = Required<Omit<PageData, "type">> & {
  resourceType: "file" | "post"
}
