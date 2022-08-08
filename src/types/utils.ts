import { DirectoryData } from "./directory"

export const isDirData = (data: unknown): data is DirectoryData => {
  return (data as DirectoryData).type === "dir"
}
