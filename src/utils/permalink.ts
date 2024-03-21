export const getDefaultPermalink = (title: string) => {
  if (!title) return ""
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `/${titleSlug}/`
}
