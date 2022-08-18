import { VStack, GridItem, StackDivider } from "@chakra-ui/react"

import { useGetFoldersAndPages } from "hooks/directoryHooks"

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
    return <EmptyPageAndFolder url={url} />
  }

  if (isFoldersEmpty) {
    return (
      <GridItem
        area="content"
        as={VStack}
        spacing="2rem"
        bgColor="gray.50"
        w="100%"
        h="100%"
        divider={<StackDivider borderColor="border.divider.alt" />}
      >
        <EmptyFolder url={url} />
        <UngroupedPages pagesData={pagesData} url={url} />
      </GridItem>
    )
  }

  if (isPagesEmpty) {
    return (
      <GridItem
        area="content"
        as={VStack}
        spacing="2rem"
        bgColor="gray.50"
        w="100%"
        h="100%"
        divider={<StackDivider borderColor="border.divider.alt" />}
      >
        <WorkspaceFolders
          siteName={siteName}
          pagesData={pagesData}
          url={url}
          dirsData={dirsData}
        />
        <EmptyPage url={url} />
      </GridItem>
    )
  }

  return (
    <GridItem
      area="content"
      as={VStack}
      spacing="2rem"
      bgColor="gray.50"
      w="100%"
      h="100%"
      divider={<StackDivider borderColor="border.divider.alt" />}
    >
      <WorkspaceFolders
        siteName={siteName}
        pagesData={pagesData}
        url={url}
        dirsData={dirsData}
      />
      <UngroupedPages pagesData={pagesData} url={url} />
    </GridItem>
  )
}
