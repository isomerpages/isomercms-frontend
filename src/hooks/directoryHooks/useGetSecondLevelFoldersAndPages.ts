import { useQueries, UseQueryResult } from "react-query"

import { DIR_SECOND_LEVEL_CONTENT_KEY } from "constants/queryKeys"

import * as DirectoryService from "services/DirectoryService/index"

import {
  DirectoryData,
  PageData,
  SecondLevelFoldersAndPagesParams,
} from "types/directory"
import { isDirectoryData } from "utils"

interface CollectionOrder {
  collectionName: string
  order: string[]
}

const getCollectionOrder = (
  siteName: string,
  collectionName: string
): Promise<CollectionOrder> => {
  return DirectoryService.getCollection({
    siteName,
    collectionName,
  }).then((data) => ({ collectionName, order: data.map(({ name }) => name) }))
}

export const useGetSecondLevelFoldersAndPages = ({
  siteName,
  collectionsData = [],
}: SecondLevelFoldersAndPagesParams): UseQueryResult<CollectionOrder[]>[] => {
  const directoryQueries = collectionsData
    .filter<DirectoryData>((item): item is DirectoryData =>
      isDirectoryData(item)
    )
    .map(({ name }) => ({
      queryKey: [DIR_SECOND_LEVEL_CONTENT_KEY, siteName, name],
      queryFn: () => getCollectionOrder(siteName, name),
    }))

  return useQueries<CollectionOrder[]>(directoryQueries) as UseQueryResult<
    CollectionOrder[]
  >[]
}
