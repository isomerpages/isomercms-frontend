export interface CommentProps {
  siteName: string
  requestId: number
}

export type UpdateCommentProps = CommentProps & {
  message: string
}

export interface CommentData {
  message: string
  createdAt: number
  user: string
  isNew: boolean
}
