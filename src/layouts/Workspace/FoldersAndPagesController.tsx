import { useGetFoldersAndPages } from "hooks/directoryHooks"

import { ContentGridLayout } from "layouts/layouts"

import { DirectoryData, PageData } from "types/directory"

import {
  EmptyPageAndFolder,
  EmptyFolder,
  UngroupedPages,
  WorkspaceFolders,
  EmptyPage,
} from "./components/WorkspacePagesAndFoldersComponents"

export const FoldersAndPagesController = (props: {
  siteName: string
  url: string
  pagesData: PageData[]
}): JSX.Element => {
  const { siteName, url, pagesData } = props
  const { data: _dirsAndPagesData } = useGetFoldersAndPages({ siteName })
  const dirsData = (_dirsAndPagesData || []).filter((data) => {
    return data.type === "dir" // only get directories and not pages
  }) as DirectoryData[]
  const isPagesEmpty =
    pagesData.filter((page) => page.name !== "contact-us.md").length === 0
  const isFoldersEmpty = !dirsData || dirsData.length === 0

  if (isPagesEmpty && isFoldersEmpty) {
    return <EmptyPageAndFolder />
  }

  if (isFoldersEmpty) {
    return (
      <ContentGridLayout>
        <EmptyFolder url={url} />
        <UngroupedPages pagesData={pagesData} url={url} />
      </ContentGridLayout>
    )
  }

  if (isPagesEmpty) {
    return (
      <ContentGridLayout>
        <WorkspaceFolders
          siteName={siteName}
          pagesData={pagesData}
          url={url}
          dirsData={dirsData}
        />
        <EmptyPage url={url} />
      </ContentGridLayout>
    )
  }

  return (
    <ContentGridLayout>
      <WorkspaceFolders
        siteName={siteName}
        pagesData={pagesData}
        url={url}
        dirsData={dirsData}
      />
      <UngroupedPages pagesData={pagesData} url={url} />
    </ContentGridLayout>
  )
}
