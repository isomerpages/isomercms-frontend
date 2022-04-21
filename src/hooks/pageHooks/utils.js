export function retrievePageInfo({ data, pageData, resourceRoomName }) {
  const trimmedNameData = {
    ...data,
    title: data.title.trim(),
  }
  return {
    frontMatter:
      pageData && pageData.content
        ? {
            ...pageData.content.frontMatter,
            ...trimmedNameData,
          }
        : trimmedNameData,
    sha: pageData?.sha || "",
    pageBody: pageData?.content?.pageBody || "",
    newFileName: resourceRoomName
      ? `${trimmedNameData.date}-${trimmedNameData.layout}-${trimmedNameData.title}.md`
      : `${trimmedNameData.title}.md`,
  }
}
