export function retrieveMediaInfo({ data }) {
  return {
    sha: data.sha,
    newFileName: data.name.trim(),
    content: data.content,
  }
}
