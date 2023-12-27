export const USER_TYPES = {
  Email: {
    Admin: "Email admin",
    Collaborator: "Email collaborator",
  },
  Github: "Github user",
} as const

export type EmailUserTypes = typeof USER_TYPES["Email"][keyof typeof USER_TYPES["Email"]]
