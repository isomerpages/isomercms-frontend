import { DirectoryInfoProps, DirectoryInfoReturn } from "types/directory"
import { getMediaDirectoryName } from "utils"

export function extractCreateDirectoryInfo({
  data,
  mediaDirectoryName,
}: DirectoryInfoProps): DirectoryInfoReturn {
  return {
    items: data.items,
    newDirectoryName: mediaDirectoryName
      ? `${mediaDirectoryName}/${data.newDirectoryName.trim()}`
      : data.newDirectoryName.trim(),
  }
}

export function extractUpdateDirectoryInfo({
  data,
  mediaDirectoryName,
}: DirectoryInfoProps): Pick<DirectoryInfoReturn, "newDirectoryName"> {
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
