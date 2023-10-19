import { useQuery, UseQueryResult } from "react-query"

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

const getSecondLevelFoldersAndPages = ({
  siteName,
  collectionsData = [],
}: SecondLevelFoldersAndPagesParams) => {
  return Promise.all(
    collectionsData
      .filter<DirectoryData>((item): item is DirectoryData =>
        isDirectoryData(item)
      )
      .map(
        ({ name }) =>
          DirectoryService.getCollection({
            siteName,
            collectionName: name,
          })
            .then((data) => ({
              collectionName: name,
              order: data.map(({ name: directoryName }) => directoryName),
            }))
            .catch((_) => null) as Promise<OrderedCollection | null>
      )
  )
}

export const useGetSecondLevelFoldersAndPages = ({
  siteName,
  collectionsData = [],
}: SecondLevelFoldersAndPagesParams): UseQueryResult<
  (OrderedCollection | null)[]
> => {
  return useQuery<(OrderedCollection | null)[]>(
    [DIR_SECOND_LEVEL_DIRECTORIES_KEY, ...collectionsData],
    () => getSecondLevelFoldersAndPages({ siteName, collectionsData }),
    {
      retry: false,
      cacheTime: 0, // We want to refetch data on every page load because file order may have changed
    }
  )
}
