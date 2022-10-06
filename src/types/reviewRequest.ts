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

export interface UserDto {
  role: "ADMIN" | "CONTRIBUTOR"
  email: string
}

export interface ReviewRequestInfo {
  title: string
  description?: string
  reviewers: User[]
}

export interface ReviewRequestDto extends Omit<ReviewRequestInfo, "reviewers"> {
  reviewers: string[]
}

export interface ReviewRequest {
  reviewUrl: string
  title: string
  requestor: string
  reviewers: string[]
  reviewRequestedTime: number
  changedItems: EditedItemProps[]
}
