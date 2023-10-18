import { useQueries, UseQueryResult } from "react-query"

import { DIR_SECOND_LEVEL_DIRECTORIES_KEY } from "constants/queryKeys"

import * as DirectoryService from "services/DirectoryService/index"

import {
  DirectoryData,
  SecondLevelFoldersAndPagesParams,
} from "types/directory"
import { isDirectoryData } from "utils"

interface OrderedCollection {
  collectionName: string
  order: string[]
}

export const useGetSecondLevelFoldersAndPages = ({
  siteName,
  collectionsData = [],
}: SecondLevelFoldersAndPagesParams): UseQueryResult<OrderedCollection[]>[] => {
  const directoryQueries = collectionsData
    .filter<DirectoryData>((item): item is DirectoryData =>
      isDirectoryData(item)
    )
    .map(({ name }) => ({
      queryKey: [DIR_SECOND_LEVEL_DIRECTORIES_KEY, siteName, name],
      queryFn: () =>
        DirectoryService.getCollection({
          siteName,
          collectionName: name,
        }).then((data) => ({
          collectionName: name,
          order: data.map(({ name: directoryName }) => directoryName),
        })),
    }))

  return useQueries<OrderedCollection[]>(directoryQueries) as UseQueryResult<
    OrderedCollection[]
  >[]
}
