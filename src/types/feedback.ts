import { UserType } from "./user"

export interface FeedbackDto {
  rating: number
  feedback: string
  email: string
  userType: UserType
}
