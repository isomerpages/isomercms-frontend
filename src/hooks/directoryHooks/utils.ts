import { getMediaDirectoryName } from "utils"

interface DirectoryInfoProps {
  data: {
    items: unknown
    newDirectoryName: string
  }
  mediaDirectoryName: string
}

interface DirectoryInfoReturn {
  items: DirectoryInfoProps["data"]["items"]
  newDirectoryName: string
}

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
