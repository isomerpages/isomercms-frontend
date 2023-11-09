import { useRouteMatch } from "react-router-dom"

import { BreadcrumbItem, Breadcrumbs } from "components/Breadcrumbs"

import { MAX_MEDIA_BREADCRUMBS_LENGTH } from "constants/media"

import { deslugifyDirectory } from "utils"

// NOTE: Media directories are recursively nested;
// However, this nesting is marked by %2F in the url parameter.
// Hence, we have to parse the mediaDirectoryName to get the nesting params.
export const MediaBreadcrumbs = (): JSX.Element => {
  const {
    params: { mediaDirectoryName, siteName, mediaRoom: mediaType },
  } = useRouteMatch<{
    mediaDirectoryName: string
    siteName: string
    mediaRoom: "files" | "images"
  }>()
  const directories = mediaDirectoryName.split("%2F")
  const firstItem = directories[0]
  const breadcrumbItems = directories.slice(1).reduce<BreadcrumbItem[]>(
    (mediaDirectoriesInfo, currentMediaDirectoryInfo) => {
      const prev = mediaDirectoriesInfo[mediaDirectoriesInfo.length - 1]
      const directoryUrl = `${prev.url}%2F${currentMediaDirectoryInfo}`
      const displayedDirectoryName = deslugifyDirectory(
        currentMediaDirectoryInfo
      )
      return [
        ...mediaDirectoriesInfo,
        {
          title: displayedDirectoryName,
          url: directoryUrl,
        },
      ]
    },
    [
      {
        title: deslugifyDirectory(firstItem),
        url: `/sites/${siteName}/media/${mediaType}/mediaDirectory/${firstItem}`,
      },
    ]
  )

  return (
    <Breadcrumbs
      items={breadcrumbItems}
      maxBreadcrumbsLength={MAX_MEDIA_BREADCRUMBS_LENGTH}
    />
  )
}
