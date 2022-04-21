import { getMediaDirectoryName } from "utils"

export function retrieveCreateDirectoryInfo({ data, mediaDirectoryName }) {
  return {
    items: data.items,
    newDirectoryName: mediaDirectoryName
      ? `${mediaDirectoryName}/${data.newDirectoryName.trim()}`
      : data.newDirectoryName.trim(),
  }
}

export function retrieveUpdateDirectoryInfo({ data, mediaDirectoryName }) {
  return {
    newDirectoryName: mediaDirectoryName
      ? `${getMediaDirectoryName(mediaDirectoryName, {
          end: -1,
          splitOn: "/",
          joinOn: "/",
        })}/${data.newDirectoryName.trim()}`
      : data.newDirectoryName.trim(),
  }
}
