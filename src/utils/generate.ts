import { deslugifyDirectory } from "./deslugify"

export const generateImageorFilePath = (
  customPath: string,
  fileName: string
): string => {
  if (customPath) return encodeURIComponent(`${customPath}/${fileName}`)
  return fileName
}

export const getNavFolderDropdownFromFolderOrder = (
  folderOrder: string[]
): string[] => {
  return folderOrder.reduce<string[]>((acc, curr) => {
    const pathArr = curr.split("/") // sample paths: "prize-sponsor.md", "prize-jury/nominating-committee.md"

    if (pathArr.length === 1) {
      acc.push(deslugifyDirectory(curr.split(".")[0])) // remove file extension
    }

    if (
      pathArr.length === 2 &&
      deslugifyDirectory(pathArr[0]) !== acc[acc.length - 1] &&
      pathArr[1] !== ".keep"
    ) {
      acc.push(deslugifyDirectory(pathArr[0]))
    }

    return acc
  }, [])
}
