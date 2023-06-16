export interface UnlinkedPageDto {
  pageName: string
  sha: string
  content: {
    frontMatter: string
    pageBody: string
  }
}
