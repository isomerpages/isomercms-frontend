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

export interface EditedItemProps {
  type: FileType[]
  name: string
  path: string[]
  url: string
  lastEditedBy: string
  lastEditedTime: number
}

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
