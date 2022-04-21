export function extractMediaInfo({ data }) {
  return {
    sha: data.sha,
    newFileName: data.name.trim(),
    content: data.content,
  }
}
