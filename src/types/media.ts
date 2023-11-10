export type MediaFolderTypes = "files" | "images"

export interface MultipleMediaParams {
  siteName: string
  mediaSrcs: Set<string>
}

export interface MediaLabels {
  articleLabel: "a" | "an"
  singularMediaLabel: "file" | "image"
  pluralMediaLabel: "files" | "images"
  singularDirectoryLabel: "directory" | "album"
  pluralDirectoryLabel: "directories" | "albums"
}

export interface SelectedMediaDto {
  filePath: string
  size: number
  sha: string
}

export interface MediaCreationInfo {
  content: string
  newFileName: string
}

export interface MoveSelectedMediaDto {
  target: {
    directoryName: string
  }
  items: SelectedMediaDto[]
}

export interface MoveMultipleMediaDto {
  source: string
  target: { directoryName: string }
  items: Array<{ name: string; type: "file" }>
}

export interface MediaFolderCreationInfo {
  newDirectoryName: string
  selectedPages: SelectedMediaDto[]
}
