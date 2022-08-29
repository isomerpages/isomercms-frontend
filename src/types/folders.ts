import type { SetOptional } from "type-fest"

export interface FolderUrlParams {
  siteName: string
  collectionName: string
  subCollectionName?: string
}

export interface MediaDirectoryParams {
  siteName: string
  mediaDirectoryName: string
}

export type PageDirectoryParams = SetOptional<FolderUrlParams, "collectionName">
