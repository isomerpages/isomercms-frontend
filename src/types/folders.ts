import type { SetOptional } from "type-fest"

export interface FolderUrlParams {
  siteName: string
  collectionName: string
  subCollectionName?: string
}

export interface MediaDirectoryParams {
  siteName: string
  mediaDirectoryName: string
  curPage: number
}

export type DirectoryParams = Omit<FolderUrlParams, "subCollectionName">

export type PageDirectoryParams = SetOptional<FolderUrlParams, "collectionName">
