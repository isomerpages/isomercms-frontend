export const extractInitials = (name: string): string => {
  const processedName = name.replace(/^@/, "")
  return processedName.slice(0, 2).split("").join(" ")
}
