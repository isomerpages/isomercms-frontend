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
