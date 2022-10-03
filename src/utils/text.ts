export const extractInitials = (name: string): string =>
  name.slice(0, 2).split("").join(" ")
