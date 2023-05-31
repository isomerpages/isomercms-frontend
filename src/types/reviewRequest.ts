import type { SetOptional } from "type-fest"

export enum ReviewRequestStatus {
  OPEN = "OPEN",
  APPROVED = "APPROVED",
  MERGED = "MERGED",
  CLOSED = "CLOSED",
}

export interface User {
  value: string
  label: string
}

type FileType = "page" | "nav" | "setting" | "file" | "image"

export interface BaseEditedItemDto {
  name: string
  path: string[]
  type: FileType
}

export type WithEditMeta<T> = T & {
  lastEditedBy: string
  lastEditedTime: number
  title: string
}

export interface EditedPageDto extends BaseEditedItemDto {
  type: "page"
  stagingUrl: string
  cmsFileUrl: string
}

export interface EditedConfigDto extends BaseEditedItemDto {
  type: "nav" | "setting"
}

export interface EditedMediaDto extends BaseEditedItemDto {
  type: "file" | "image"
}

export type EditedItemProps = WithEditMeta<
  EditedPageDto | EditedConfigDto | EditedMediaDto
>

export interface ReviewRequestInfo {
  title: string
  description?: string
  reviewers: User[]
}

export interface CreateReviewRequestDto
  extends Omit<ReviewRequestInfo, "reviewers"> {
  reviewers: string[]
}

export type UpdateReviewRequestDto = SetOptional<
  CreateReviewRequestDto,
  "title"
>

export interface ReviewRequest {
  reviewUrl: string
  title: string
  status: ReviewRequestStatus
  requestor: string
  reviewers: string[]
  reviewRequestedTime: number
  changedItems: EditedItemProps[]
}

export interface BlobDiff {
  oldValue: string
  newValue: string
}
