export interface LoggedInUser {
  userId: string
  email: string
  contactNumber: string
  displayedName: string
}

export const UserTypes = {
  Email: "email",
  Github: "github",
} as const

export type UserType = typeof UserTypes[keyof typeof UserTypes]
