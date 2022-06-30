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
}

export interface PageData {
  name: string
  title?: string
  date?: string
  resourceType?: "file" | "post"
}

export type ResourcePageData = Required<PageData>
