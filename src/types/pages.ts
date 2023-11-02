export interface UnlinkedPageDto {
  pageName: string
  sha: string
  content: {
    frontMatter: string
    pageBody: string
  }
}

export type PageVariant = "tiptap" | "markdown"
